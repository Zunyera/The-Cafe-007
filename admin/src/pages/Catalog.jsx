import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { money } from '../utils.js';

const SIZES = ['Small', 'Medium', 'Large'];

export default function Catalog() {
  const [tab, setTab] = useState('foods');
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [deals, setDeals] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  function load() {
    api.get('/categories?all=1').then(data => setCategories(data.categories)).catch(problem => setError(problem.message));
    api.get('/foods?includeUnavailable=1').then(data => setFoods(data.foods)).catch(problem => setError(problem.message));
    api.get('/deals?includeUnavailable=1').then(data => setDeals(data.deals)).catch(problem => setError(problem.message));
  }
  useEffect(load, []);

  function foodForm(food) {
    const sizes = {};
    (food.sizes || []).forEach(size => { sizes[size.name] = size.price; });
    return {
      kind: 'food',
      _id: food._id || null,
      name: food.name || '',
      category: food.category?._id || food.category || categories[0]?._id || '',
      subCategory: food.subCategory || '',
      basePrice: food.basePrice ?? '',
      image: food.image || '',
      description: food.description || '',
      isAvailable: food.isAvailable !== false,
      isPopular: Boolean(food.isPopular),
      isFeatured: Boolean(food.isFeatured),
      sizes,
    };
  }

  function dealForm(deal) {
    return {
      kind: 'deal',
      _id: deal._id || null,
      name: deal.name || '',
      price: deal.price ?? '',
      image: deal.image || '',
      items: (deal.items || []).join('\n'),
      isAvailable: deal.isAvailable !== false,
    };
  }

  async function save(event) {
    event.preventDefault();
    setError('');
    try {
      if (editing.kind === 'food') {
        const sizes = SIZES.filter(name => editing.sizes[name] !== '' && editing.sizes[name] != null)
          .map(name => ({ name, price: Number(editing.sizes[name]) || 0 }));
        const body = {
          name: editing.name,
          category: editing.category,
          subCategory: editing.subCategory,
          basePrice: Number(editing.basePrice) || 0,
          sizes,
          image: editing.image,
          description: editing.description,
          isAvailable: editing.isAvailable,
          isPopular: editing.isPopular,
          isFeatured: editing.isFeatured,
        };
        if (editing._id) await api.put(`/foods/${editing._id}`, body);
        else await api.post('/foods', body);
      } else {
        const body = {
          name: editing.name,
          price: Number(editing.price) || 0,
          image: editing.image,
          items: String(editing.items || '').split('\n').map(line => line.trim()).filter(Boolean),
          isAvailable: editing.isAvailable,
        };
        if (editing._id) await api.put(`/deals/${editing._id}`, body);
        else await api.post('/deals', body);
      }
      setEditing(null);
      load();
    } catch (problem) {
      setError(problem.message);
    }
  }

  async function remove(kind, item) {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    try {
      await api.delete(`/${kind}/${item._id}`);
      load();
    } catch (problem) {
      setError(problem.message);
    }
  }

  async function addCategory(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = String(new FormData(form).get('name') || '').trim();
    if (!name) return;
    try {
      await api.post('/categories', { name });
      form.reset();
      load();
    } catch (problem) {
      setError(problem.message);
    }
  }

  const list = tab === 'foods' ? foods : deals;

  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-eyebrow">Official Café 007 menu</p>
          <h1>Menu, deals &amp; categories</h1>
        </div>
        {tab !== 'categories' && (
          <button type="button" className="admin-button" onClick={() => setEditing(tab === 'foods' ? foodForm({}) : dealForm({}))}>
            + New {tab === 'foods' ? 'food' : 'deal'}
          </button>
        )}
      </header>

      <div className="admin-tabs" style={{ marginBottom: 18 }}>
        <button type="button" className={tab === 'foods' ? 'active' : ''} onClick={() => setTab('foods')}>Foods ({foods.length})</button>
        <button type="button" className={tab === 'deals' ? 'active' : ''} onClick={() => setTab('deals')}>Deals ({deals.length})</button>
        <button type="button" className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')}>Categories ({categories.length})</button>
      </div>

      {error && <p className="admin-error page" role="alert">{error}</p>}

      {tab === 'categories' && (
        <>
          <form className="admin-filters" onSubmit={addCategory}>
            <input name="name" placeholder="New category name" required />
            <button type="submit" className="admin-button">Add category</button>
          </form>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(item => (
                  <tr key={item._id}>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.slug}</td>
                    <td>{item.sortOrder}</td>
                    <td><span className={`admin-pill ${item.isActive ? 'delivered' : 'cancelled'}`}>{item.isActive ? 'active' : 'hidden'}</span></td>
                    <td className="admin-row-actions">
                      <button type="button" className="danger" onClick={() => remove('categories', item)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab !== 'categories' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{tab === 'foods' ? 'Food' : 'Deal'}</th>
                <th>{tab === 'foods' ? 'Category' : 'Items'}</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(item => (
                <tr key={item._id}>
                  <td>
                    <strong>{item.name}</strong>
                    <small>
                      {tab === 'foods' && item.sizes?.length
                        ? item.sizes.map(size => `${size.name[0]} ${money(size.price)}`).join(' · ')
                        : (item.items || []).join(' + ')}
                    </small>
                  </td>
                  <td>{tab === 'foods' ? (item.category?.name || item.subCategory) : `${(item.items || []).length} items`}</td>
                  <td>{money(tab === 'foods' ? item.basePrice : item.price)}</td>
                  <td>
                    <span className={`admin-pill ${item.isAvailable === false ? 'cancelled' : 'delivered'}`}>
                      {item.isAvailable === false ? 'hidden' : 'available'}
                    </span>
                  </td>
                  <td className="admin-row-actions">
                    <button type="button" onClick={() => setEditing(tab === 'foods' ? foodForm(item) : dealForm(item))}>Edit</button>
                    <button type="button" className="danger" onClick={() => remove(tab, item)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="admin-modal" onMouseDown={event => { if (event.target === event.currentTarget) setEditing(null); }}>
          <form className="admin-modal-card" onSubmit={save}>
            <h2>{editing._id ? 'Edit' : 'New'} {editing.kind}</h2>
            <div className="admin-form-grid">
              <label>
                Name
                <input required value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
              </label>

              {editing.kind === 'food' ? (
                <>
                  <label>
                    Category
                    <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </label>
                  <label>
                    Base price
                    <input type="number" min="0" value={editing.basePrice} onChange={e => setEditing({ ...editing, basePrice: e.target.value })} />
                  </label>
                  <label>
                    Sub category
                    <input value={editing.subCategory} onChange={e => setEditing({ ...editing, subCategory: e.target.value })} placeholder="Regular Pizza" />
                  </label>
                  <label className="wide">
                    Image URL
                    <input value={editing.image} onChange={e => setEditing({ ...editing, image: e.target.value })} placeholder="https://..." />
                  </label>
                  <label className="wide">
                    Description
                    <textarea rows="2" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
                  </label>
                  <label className="wide">
                    Sizes (Small / Medium / Large prices — leave empty if not a pizza)
                    <div className="admin-inline">
                      {SIZES.map(size => (
                        <input
                          key={size}
                          type="number"
                          placeholder={size}
                          value={editing.sizes[size] ?? ''}
                          onChange={e => setEditing({ ...editing, sizes: { ...editing.sizes, [size]: e.target.value } })}
                        />
                      ))}
                    </div>
                  </label>
                  <label className="wide admin-check">
                    <input type="checkbox" checked={editing.isAvailable} onChange={e => setEditing({ ...editing, isAvailable: e.target.checked })} /> Available on the website
                  </label>
                  <label className="admin-check">
                    <input type="checkbox" checked={editing.isPopular} onChange={e => setEditing({ ...editing, isPopular: e.target.checked })} /> Popular
                  </label>
                  <label className="admin-check">
                    <input type="checkbox" checked={editing.isFeatured} onChange={e => setEditing({ ...editing, isFeatured: e.target.checked })} /> Featured
                  </label>
                </>
              ) : (
                <>
                  <label>
                    Price
                    <input type="number" min="0" value={editing.price} onChange={e => setEditing({ ...editing, price: e.target.value })} />
                  </label>
                  <label>
                    Image URL
                    <input value={editing.image} onChange={e => setEditing({ ...editing, image: e.target.value })} placeholder="https://..." />
                  </label>
                  <label className="wide">
                    Deal items (one item per line)
                    <textarea rows="4" value={editing.items} onChange={e => setEditing({ ...editing, items: e.target.value })} placeholder={'1 Zinger Burger\n1 Regular Drink'} />
                  </label>
                  <label className="wide admin-check">
                    <input type="checkbox" checked={editing.isAvailable} onChange={e => setEditing({ ...editing, isAvailable: e.target.checked })} /> Available on the website
                  </label>
                </>
              )}
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-button ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="admin-button">Save</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}