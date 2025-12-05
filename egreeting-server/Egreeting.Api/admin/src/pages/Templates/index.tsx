// src/pages/Templates/index.tsx
import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Spinner,
  Alert,
  Badge,
  Modal,
  Form,
  Image,
  Stack,
} from 'react-bootstrap';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

interface Category {
  id: number;
  name: string;
}

interface Template {
  id: number;
  categoryId: number;
  categoryName: string;
  title: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  price: number;
  isActive: boolean;
  createdAt: string;
}

const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Partial<Template>>({
    categoryId: 0,
    title: '',
    imageUrl: '',
    videoUrl: '',
    price: 0,
    isActive: true,
  });

  // Preview modals
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [previewVideoUrl, setPreviewVideoUrl] = useState('');

  const loadCategories = async () => {
    try {
      const data = await apiGet<Category[]>('api/category');
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Template[]>('api/template/with-relations');
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load templates');
      console.error('Load templates error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadTemplates();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentTemplate({
      categoryId: 0,
      title: '',
      imageUrl: '',
      videoUrl: '',
      price: 0,
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (template: Template) => {
    setIsEditMode(true);
    setCurrentTemplate({
      id: template.id,
      categoryId: template.categoryId,
      title: template.title,
      imageUrl: template.imageUrl || '',
      videoUrl: template.videoUrl || '',
      price: template.price,
      isActive: template.isActive,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSave = async () => {
    if (!currentTemplate.categoryId || !currentTemplate.title || currentTemplate.price == null) {
      alert('Please fill in all required fields: Category, Title, and Price');
      return;
    }

    try {
      const payload = {
        categoryId: Number(currentTemplate.categoryId),
        title: currentTemplate.title,
        imageUrl: currentTemplate.imageUrl || null,
        videoUrl: currentTemplate.videoUrl || null,
        price: Number(currentTemplate.price),
        isActive: currentTemplate.isActive ?? true,
      };

      if (isEditMode && currentTemplate.id) {
        await apiPut(`api/template/${currentTemplate.id}/update`, payload);
        alert('Template updated successfully!');
      } else {
        await apiPost('api/template/create', payload);
        alert('Template added successfully!');
      }

      handleCloseModal();
      loadTemplates();
    } catch (err: any) {
      console.error('Save template error:', err);
      alert('Error: ' + (err.message || 'Could not save template'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;

    try {
      await apiDelete(`api/template/delete/${id}`);
      alert('Template deleted successfully!');
      loadTemplates();
    } catch (err: any) {
      console.error('Delete template error:', err);
      alert('Error: ' + (err.message || 'Could not delete template'));
    }
  };

  const openImagePreview = (url: string) => {
    setPreviewImageUrl(url);
    setShowImageModal(true);
  };

  const openVideoPreview = (url: string) => {
    let embedUrl = url;
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    setPreviewVideoUrl(embedUrl);
    setShowVideoModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Templates Management</h2>
        <Stack direction="horizontal" gap={3}>
          <Badge bg="primary" className="fs-5 align-self-center">
            Total: {templates.length}
          </Badge>
          <Button variant="primary" onClick={openAddModal}>
            Add Template
          </Button>
        </Stack>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading templates...</p>
        </div>
      )}

      {/* Error State */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Empty State */}
      {!loading && !error && templates.length === 0 && (
        <Alert variant="info" className="text-center">
          No templates found. Click "Add Template" to create one.
        </Alert>
      )}

      {/* Templates Table */}
      {!loading && templates.length > 0 && (
        <div className="table-responsive">
          <Table striped hover bordered className="align-middle">
            <thead className="table-light">
              <tr>
                <th width="60">#</th>
                <th>ID</th>
                <th>Category</th>
                <th>Title</th>
                <th>Image</th>
                <th>Video</th>
                <th>Price</th>
                <th>Active</th>
                <th>Created At</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t, i) => (
                <tr key={t.id}>
                  <td>{i + 1}</td>
                  <td className="fw-bold">#{t.id}</td>
                  <td>{t.categoryName || <em className="text-muted">—</em>}</td>
                  <td>{t.title}</td>
                  <td>
                    {t.imageUrl ? (
                      <Image
                        src={t.imageUrl}
                        alt="thumb"
                        rounded
                        style={{
                          width: 80,
                          height: 60,
                          objectFit: 'cover',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                        }}
                        className="shadow-sm"
                        onClick={() => openImagePreview(t.imageUrl!)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </td>
                  <td>
                    {t.videoUrl ? (
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => openVideoPreview(t.videoUrl!)}
                      >
                        View Video
                      </Button>
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </td>
                  <td>${t.price.toFixed(2)}</td>
                  <td>
                    <Badge bg={t.isActive ? 'success' : 'secondary'}>
                      {t.isActive ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td>{formatDate(t.createdAt)}</td>
                  <td className="text-center">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => openEditModal(t)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(t.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit Template' : 'Add New Template'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={currentTemplate.categoryId || ''}
                onChange={(e) =>
                  setCurrentTemplate({ ...currentTemplate, categoryId: Number(e.target.value) })
                }
                required
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                value={currentTemplate.title || ''}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                value={currentTemplate.imageUrl || ''}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Video URL (YouTube)</Form.Label>
              <Form.Control
                type="url"
                value={currentTemplate.videoUrl || ''}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, videoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={currentTemplate.price || 0}
                onChange={(e) =>
                  setCurrentTemplate({ ...currentTemplate, price: parseFloat(e.target.value) || 0 })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={currentTemplate.isActive ?? true}
                onChange={(e) =>
                  setCurrentTemplate({ ...currentTemplate, isActive: e.target.checked })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Image Preview Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image src={previewImageUrl} fluid rounded />
        </Modal.Body>
      </Modal>

      {/* Video Preview Modal */}
      <Modal show={showVideoModal} onHide={() => setShowVideoModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Video Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="ratio ratio-16x9">
            <iframe
              src={previewVideoUrl}
              title="YouTube video"
              allowFullScreen
              style={{ border: 0 }}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TemplatesPage;