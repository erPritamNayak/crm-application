import React, { useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Trash2, Terminal, Loader2 } from 'lucide-react';
import { API_ENDPOINT } from '@/lib/apiConfig';
import { useLeadCategories } from '@/hooks/useLeadCategories';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export const AdminConsole = () => {
  const { categories, loading, refreshCategories } = useLeadCategories();
  const [newCategory, setNewCategory] = useState('');
  const [subInputs, setSubInputs] = useState({});
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingSubFor, setSavingSubFor] = useState(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [deletingSubId, setDeletingSubId] = useState(null);

  const addCategory = async (e) => {
    e.preventDefault();
    const name = newCategory.trim();
    if (!name) {
      toast.error('Enter a category name');
      return;
    }
    setSavingCategory(true);
    try {
      await axios.post(`${API_ENDPOINT}/lead-categories`, { name }, authHeaders());
      toast.success('Category created');
      setNewCategory('');
      refreshCategories();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create category');
    } finally {
      setSavingCategory(false);
    }
  };

  const removeCategory = async (categoryId) => {
    if (!window.confirm('Delete this category and all its subcategories?')) return;
    setDeletingCategoryId(categoryId);
    try {
      await axios.delete(`${API_ENDPOINT}/lead-categories/${categoryId}`, authHeaders());
      toast.success('Category deleted');
      refreshCategories();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete category');
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const addSubcategory = async (categoryId) => {
    const name = (subInputs[categoryId] || '').trim();
    if (!name) {
      toast.error('Enter a subcategory name');
      return;
    }
    setSavingSubFor(categoryId);
    try {
      await axios.post(`${API_ENDPOINT}/lead-categories/${categoryId}/subcategories`, { name }, authHeaders());
      toast.success('Subcategory added');
      setSubInputs((prev) => ({ ...prev, [categoryId]: '' }));
      refreshCategories();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add subcategory');
    } finally {
      setSavingSubFor(null);
    }
  };

  const removeSubcategory = async (categoryId, subcategoryId) => {
    setDeletingSubId(subcategoryId);
    try {
      await axios.delete(`${API_ENDPOINT}/lead-categories/${categoryId}/subcategories/${subcategoryId}`, authHeaders());
      toast.success('Subcategory deleted');
      refreshCategories();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete subcategory');
    } finally {
      setDeletingSubId(null);
    }
  };

  return (
    <div className="space-y-6" data-testid="admin-console-page">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Terminal className="h-7 w-7 text-indigo-600" />
          Admin Console
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage lead categories and subcategories. These options appear in the New Lead popup.
        </p>
      </div>

      <Card className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add category</h2>
        <form onSubmit={addCategory} className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="new-category">Category name</Label>
            <Input
              id="new-category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Project, Automation"
              className="h-11"
            />
          </div>
          <Button type="submit" className="sm:self-end bg-indigo-600 hover:bg-indigo-700 text-white h-11" disabled={savingCategory}>
            {savingCategory ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Add category
          </Button>
        </form>
      </Card>

      <Card className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Categories & subcategories</h2>
          <Button variant="outline" size="sm" onClick={refreshCategories} disabled={loading}>
            {loading ? 'Loading…' : 'Refresh'}
          </Button>
        </div>

        {loading && categories.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No categories yet. Add one above.</p>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.id} className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{cat.name}</p>
                    <p className="text-xs text-gray-500">{(cat.subcategories || []).length} subcategory(ies)</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    disabled={deletingCategoryId === cat.id}
                    onClick={() => removeCategory(cat.id)}
                  >
                    {deletingCategoryId === cat.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {(cat.subcategories || []).length > 0 && (
                  <ul className="mb-3 space-y-1.5">
                    {cat.subcategories.map((sub) => (
                      <li key={sub.id} className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm">
                        <span className="text-gray-800">{sub.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                          disabled={deletingSubId === sub.id}
                          onClick={() => removeSubcategory(cat.id, sub.id)}
                        >
                          {deletingSubId === sub.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={subInputs[cat.id] || ''}
                    onChange={(e) => setSubInputs((prev) => ({ ...prev, [cat.id]: e.target.value }))}
                    placeholder="New subcategory name"
                    className="h-10 bg-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSubcategory(cat.id);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 h-10"
                    disabled={savingSubFor === cat.id}
                    onClick={() => addSubcategory(cat.id)}
                  >
                    {savingSubFor === cat.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <Plus className="h-4 w-4 mr-1" />
                    )}
                    Add subcategory
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
