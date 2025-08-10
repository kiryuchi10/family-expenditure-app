#!/usr/bin/env python3
"""
Family Expenditure App - Flask Backend
Simplified version without matplotlib dependencies to avoid numpy conflicts
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import os
import sys
import json
from datetime import datetime, timedelta
import logging

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configuration from environment variables
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', 'uploads')
app.config['REPORTS_FOLDER'] = os.getenv('REPORTS_FOLDER', 'reports')
app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))

# Database configuration
mysql_user = os.getenv('MYSQL_USER', 'root')
mysql_password = os.getenv('MYSQL_PASSWORD', '12345')
mysql_host = os.getenv('MYSQL_HOST', 'localhost')
mysql_port = os.getenv('MYSQL_PORT', '3306')
mysql_db = os.getenv('MYSQL_DB', 'family_finance')

# Try MySQL first, fallback to SQLite
try:
    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{mysql_user}:{mysql_password}@{mysql_host}:{mysql_port}/{mysql_db}'
    print(f"Using MySQL database: {mysql_db}")
except:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///expense_tracker.db'
    print("Using SQLite database (fallback)")

db = SQLAlchemy(app)

# CORS configuration
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
CORS(app, origins=cors_origins)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)

# Ensure required directories exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['REPORTS_FOLDER'], exist_ok=True)

# Simple file processing function
def process_csv_file(filepath):
    """Simple CSV processing function without pandas to avoid numpy conflicts"""
    try:
        import csv
        data = []
        with open(filepath, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            columns = csv_reader.fieldnames
            for i, row in enumerate(csv_reader):
                if i < 10:  # Only process first 10 rows for preview
                    data.append(dict(row))
                
        return {
            'status': 'success',
            'rows_processed': len(data),
            'columns': columns or [],
            'data': data
        }
    except Exception as e:
        return {'status': 'error', 'message': str(e)}

# Database models
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    transactions = db.relationship('Transaction', backref='user', lazy=True)

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    big_category = db.Column(db.String(100), nullable=False)
    sub_category = db.Column(db.String(100), nullable=False)
    item_category = db.Column(db.String(100), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    transactions = db.relationship('Transaction', backref='category', lazy=True)

class Company(db.Model):
    __tablename__ = 'companies'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    company_type = db.Column(db.String(50), nullable=True)
    api_endpoint = db.Column(db.String(200), nullable=True)
    api_available = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    transactions = db.relationship('Transaction', backref='company', lazy=True)

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    transaction_date = db.Column(db.DateTime, nullable=False)
    description = db.Column(db.String(500), nullable=False)
    transaction_type = db.Column(db.String(50), nullable=True)
    institution = db.Column(db.String(100), nullable=True)
    account_number = db.Column(db.String(50), nullable=True)
    amount = db.Column(db.Float, nullable=False)
    balance = db.Column(db.Float, nullable=True)
    memo = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

class Budget(db.Model):
    __tablename__ = 'budgets'
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    monthly_limit = db.Column(db.Float, nullable=False)
    yearly_limit = db.Column(db.Float, nullable=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    is_active = db.Column(db.Boolean, default=True)

# Helper: allowed file extensions
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls', 'txt'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Routes
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    logger.info(f"Saved upload to {filepath}")

    # Process and remove
    result = process_csv_file(filepath)
    os.remove(filepath)
    return jsonify(result)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    try:
        transactions = Transaction.query.all()
        return jsonify([{
            'id': t.id,
            'date': t.transaction_date.isoformat() if t.transaction_date else None,
            'description': t.description,
            'amount': t.amount,
            'type': t.transaction_type,
            'category': t.category.big_category if t.category else None
        } for t in transactions])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    try:
        data = request.get_json()
        transaction = Transaction(
            transaction_date=datetime.fromisoformat(data['date']),
            description=data['description'],
            amount=float(data['amount']),
            transaction_type=data.get('type', 'expense'),
            user_id=1  # Default to demo user
        )
        db.session.add(transaction)
        db.session.commit()
        return jsonify({'status': 'success', 'id': transaction.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.filter_by(is_active=True).all()
        
        # Calculate spending for each category
        categories_with_spending = []
        for c in categories:
            # Calculate total spending for this category
            total_spending = db.session.query(db.func.sum(Transaction.amount)).filter(
                Transaction.category_id == c.id,
                Transaction.amount < 0  # Only expenses
            ).scalar() or 0
            
            categories_with_spending.append({
                'id': c.id,
                'big_category': c.big_category,
                'sub_category': c.sub_category,
                'item_category': c.item_category,
                'spending': abs(total_spending)
            })
        
        return jsonify(categories_with_spending)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories', methods=['POST'])
def add_category():
    try:
        data = request.get_json()
        category = Category(
            big_category=data['big_category'],
            sub_category=data['sub_category'],
            item_category=data.get('item_category')
        )
        db.session.add(category)
        db.session.commit()
        return jsonify({'status': 'success', 'id': category.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard/summary', methods=['GET'])
def get_dashboard_summary():
    try:
        # Get recent transactions
        recent_transactions = Transaction.query.order_by(Transaction.transaction_date.desc()).limit(5).all()
        
        # Calculate totals
        total_income = db.session.query(db.func.sum(Transaction.amount)).filter(
            Transaction.amount > 0
        ).scalar() or 0
        
        total_expenses = db.session.query(db.func.sum(Transaction.amount)).filter(
            Transaction.amount < 0
        ).scalar() or 0
        
        return jsonify({
            'total_income': total_income,
            'total_expenses': abs(total_expenses),
            'balance': total_income + total_expenses,
            'recent_transactions': [{
                'id': t.id,
                'date': t.transaction_date.isoformat() if t.transaction_date else None,
                'description': t.description,
                'amount': t.amount
            } for t in recent_transactions]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Database initialization
def initialize_db():
    with app.app_context():
        db.create_all()
        
        # Create demo user if not exists
        if not User.query.first():
            demo = User(username='demo', email='demo@example.com')
            db.session.add(demo)
            db.session.commit()
            logger.info('Created default demo user')
        
        # Create sample categories if not exists
        if not Category.query.first():
            sample_categories = [
                {'big_category': 'Food', 'sub_category': 'Groceries'},
                {'big_category': 'Food', 'sub_category': 'Restaurants'},
                {'big_category': 'Transportation', 'sub_category': 'Gas'},
                {'big_category': 'Transportation', 'sub_category': 'Public Transit'},
                {'big_category': 'Entertainment', 'sub_category': 'Movies'},
                {'big_category': 'Shopping', 'sub_category': 'Clothing'},
                {'big_category': 'Utilities', 'sub_category': 'Electricity'},
                {'big_category': 'Health', 'sub_category': 'Medical'}
            ]
            
            for cat_data in sample_categories:
                category = Category(**cat_data)
                db.session.add(category)
            
            db.session.commit()
            logger.info('Created sample categories')
        
        # Create sample transactions if not exists
        if not Transaction.query.first():
            sample_transactions = [
                {
                    'transaction_date': datetime.now() - timedelta(days=1),
                    'description': 'Grocery Store',
                    'amount': -85.50,
                    'transaction_type': 'expense',
                    'user_id': 1,
                    'category_id': 1
                },
                {
                    'transaction_date': datetime.now() - timedelta(days=2),
                    'description': 'Salary',
                    'amount': 3000.00,
                    'transaction_type': 'income',
                    'user_id': 1
                },
                {
                    'transaction_date': datetime.now() - timedelta(days=3),
                    'description': 'Restaurant',
                    'amount': -45.20,
                    'transaction_type': 'expense',
                    'user_id': 1,
                    'category_id': 2
                },
                {
                    'transaction_date': datetime.now() - timedelta(days=4),
                    'description': 'Gas Station',
                    'amount': -60.00,
                    'transaction_type': 'expense',
                    'user_id': 1,
                    'category_id': 3
                },
                {
                    'transaction_date': datetime.now() - timedelta(days=5),
                    'description': 'Movie Theater',
                    'amount': -25.00,
                    'transaction_type': 'expense',
                    'user_id': 1,
                    'category_id': 5
                }
            ]
            
            for trans_data in sample_transactions:
                transaction = Transaction(**trans_data)
                db.session.add(transaction)
            
            db.session.commit()
            logger.info('Created sample transactions')

if __name__ == '__main__':
    initialize_db()
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('FLASK_RUN_PORT', 5000)),
        debug=True
    )