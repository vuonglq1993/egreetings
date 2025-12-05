// src/pages/Categories/index.tsx
import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Container,
  Stack,
  Badge,
} from 'react-bootstrap';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

interface Category {
  id: number;
  name: string;
  description: string | null;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: Category[] = await apiGet('api/category');
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách danh mục');
      console.error('Load categories error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setCurrentId(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setIsEdit(true);
    setCurrentId(cat.id);
    setFormData({ name: cat.name, description: cat.description || '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSaving(false);
  };

  const saveCategory = async () => {
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên danh mục');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: currentId || 0,
        name: formData.name.trim(),
        description: formData.description.trim() || null,
      };

      if (isEdit && currentId) {
        await apiPut(`api/category/${currentId}`, payload);
        alert('Cập nhật danh mục thành công!');
      } else {
        await apiPost('api/category', payload);
        alert('Thêm danh mục thành công!');
      }

      closeModal();
      loadCategories();
    } catch (err: any) {
      console.error('Save error:', err);
      alert('Lỗi: ' + (err.message || 'Không thể lưu danh mục'));
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

    try {
      await apiDelete(`api/category/${id}`);
      alert('Xóa danh mục thành công!');
      loadCategories();
    } catch (err: any) {
      console.error('Delete error:', err);
      alert('Lỗi: ' + (err.message || 'Không thể xóa danh mục'));
    }
  };

  return (
    <Container fluid="xxl" className="py-4">
      {/* Header với Stack để responsive tốt hơn trên mobile */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="mb-1">Categories Management</h2>
          <Badge bg="secondary" className="fs-6">Total: {categories.length}</Badge>
        </div>

        <Button variant="primary" size="lg" onClick={openAddModal} className="d-flex align-items-center gap-2">
          <i className="bi bi-plus-circle"></i>
          <span className="d-none d-sm-inline">Add New Category</span>
          <span className="d-inline d-sm-none">Add</span>
        </Button>
      </div>

      {/* Error Alert */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted fs-5">Đang tải danh mục...</p>
        </div>
      ) : categories.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <i className="bi bi-folder2-open fs-1"></i>
          <p className="mt-3 mb-0">Chưa có danh mục nào. Nhấn nút "Add New Category" để tạo mới.</p>
        </Alert>
      ) : (
        /* Table responsive - tối ưu cho mobile */
        <div className="table-responsive rounded shadow-sm border">
          <Table hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="text-center" style={{ width: '60px' }}>#</th>
                <th>ID</th>
                <th>Name</th>
                <th className="d-none d-md-table-cell">Description</th>
                <th className="text-center" style={{ width: '140px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat.id}>
                  <td className="text-center fw-bold">{index + 1}</td>
                  <td className="fw-medium">#{cat.id}</td>
                  <td>
                    <strong>{cat.name}</strong>
                  </td>
                  <td className="d-none d-md-table-cell text-muted">
                    {cat.description || '—'}
                  </td>
                  <td className="text-center">
                    <Stack direction="horizontal" gap={2} className="justify-content-center">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => openEditModal(cat)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => deleteCategory(cat.id)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </Stack>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal - giữ nguyên đẹp */}
      <Modal show={showModal} onHide={closeModal} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? (
              <>
                <i className="bi bi-pencil-square me-2"></i>Edit Category
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-2"></i>Add New Category
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Birthday, Christmas, Wedding..."
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả ngắn về danh mục này..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveCategory} disabled={saving}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check2"></i> Save Category
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CategoriesPage;