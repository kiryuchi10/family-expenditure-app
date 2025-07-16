import React, { useState } from 'react';
import { Plus, Tag, Edit, Trash2 } from 'lucide-react';

const CategoryManager = ({ categories, onAddCategory }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    big_category: '',
    sub_category: '',
    item_category: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAddCategory(newCategory);
      setNewCategory({ big_category: '', sub_category: '', item_category: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  return (
    <div className="toss-card rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Tag className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">카테고리 관리</h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-toss-primary px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          카테고리 추가
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대분류
              </label>
              <input
                type="text"
                value={newCategory.big_category}
                onChange={(e) => setNewCategory({...newCategory, big_category: e.target.value})}
                className="input-toss w-full px-3 py-2 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                중분류
              </label>
              <input
                type="text"
                value={newCategory.sub_category}
                onChange={(e) => setNewCategory({...newCategory, sub_category: e.target.value})}
                className="input-toss w-full px-3 py-2 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                소분류 (선택)
              </label>
              <input
                type="text"
                value={newCategory.item_category}
                onChange={(e) => setNewCategory({...newCategory, item_category: e.target.value})}
                className="input-toss w-full px-3 py-2 rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn-toss-primary px-4 py-2 rounded-lg">
              추가
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="btn-toss-secondary px-4 py-2 rounded-lg"
            >
              취소
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover-lift">
            <div>
              <h3 className="font-semibold text-gray-800">{category.big_category}</h3>
              <p className="text-sm text-gray-600">{category.sub_category}</p>
              {category.item_category && (
                <p className="text-xs text-gray-500">{category.item_category}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;