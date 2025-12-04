import { useState } from "react";
import { supabase } from "../../../../lib/supabase/supabaseClient";
import { eventsService } from "../../services/eventsService";
import { eventMediaService } from "../../services/eventMediaService";
import useEventForm from "../../hooks/useEventForm";
import useCoverUpload from "../../hooks/useCoverUpload";
import useGalleryUpload from "../../hooks/useGalleryUpload";
import useGalleryDelete from "../../hooks/useGalleryDelete";

import "./EventForm.css";

const EventForm = ({ event = null, onSubmitSuccess }) => {
  const { form, setForm, handleChange } = useEventForm(event);

  const [galleryFiles, setGalleryFiles, internalHandleGalleryUpload] = (() => {
    // reaproveita hook existente
    const { galleryFiles, setGalleryFiles, handleGalleryUpload } =
      useGalleryUpload();
    return [galleryFiles, setGalleryFiles, handleGalleryUpload];
  })();

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const { handleCoverUpload } = useCoverUpload(
    form,
    setForm,
    setUploading,
    setError
  );
  const { deleteGalleryPhoto } = useGalleryDelete(form, setForm, event);

  // upload para o background_video_url (vídeo)
  const handleBackgroundVideoUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("video/")) {
        setError("Background precisa ser um vídeo.");
        return;
      }

      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;
      const filePath = `backgrounds/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("events")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("events").getPublicUrl(filePath);

      setForm((prev) => ({ ...prev, background_video_url: publicUrl }));
    } catch (err) {
      console.error("Erro no upload do vídeo de fundo:", err.message);
      setError("Falha no upload do vídeo de fundo.");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = (e) => {
    internalHandleGalleryUpload(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const basePayload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description || "",
        location: form.location.trim(),
        status: form.status,
        thumbnail_url: form.thumbnail_url || null,
        background_video_url: form.background_video_url || null,
        date: form.date ? new Date(form.date).toISOString() : null,
      };

      let savedEvent;

      if (event) {
        // update
        const { data } = await supabase.auth.getUser();
        const userId = data?.user?.id;
        savedEvent = await eventsService.updateEvent(
          event.id,
          basePayload,
          userId
        );
      } else {
        // create
        const { data } = await supabase.auth.getUser();
        const userId = data?.user?.id;
        if (!userId) throw new Error("Usuário não autenticado.");
        savedEvent = await eventsService.createEvent(basePayload, userId);
      }

      // 📷 Upload gallery files → tabela event_media
      if (galleryFiles.length > 0 && savedEvent?.id) {
        let position = 0;

        for (const file of galleryFiles) {
          const ext = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.${ext}`;
          const filePath = `gallery/${savedEvent.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("events")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("events").getPublicUrl(filePath);

          await eventMediaService.createGalleryItem({
            eventId: savedEvent.id,
            storagePath: filePath,
            publicUrl,
            position,
            alt: `${savedEvent.name} - foto ${position + 1}`,
          });

          position += 1;
        }

        // atualiza preview local juntando já existentes + novas
        setForm((prev) => ({
          ...prev,
          photos: [
            ...(prev.photos || []),
            ...galleryFiles.map((f) => f), // aqui se quiser pode trocar por URLs se você quiser voltar do backend depois
          ],
        }));
      }

      setGalleryFiles([]);

      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      console.error("Erro ao salvar evento:", err.message);
      setError("Não foi possível salvar o evento.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <h2 className="event-form__title">
        {event ? "Editar Evento" : "Criar Novo Evento"}
      </h2>

      {error && <div className="event-form__error">{error}</div>}

      <label className="event-form__label">
        Nome do Evento
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="event-form__input"
        />
      </label>

      <label className="event-form__label">
        Local
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Ex: London, UK"
          className="event-form__input"
        />
      </label>

      <label className="event-form__label">
        Data do Evento
        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="event-form__input"
        />
      </label>

      <label className="event-form__label">
        Descrição
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          className="event-form__textarea"
        />
      </label>

      <label className="event-form__label">
        Status
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="event-form__select"
        >
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
          <option value="archived">Arquivado</option>
        </select>
      </label>
      <div className="event-form__media">
        {/* Thumbnail */}
        <div className="event-form__image-upload">
          <label className="event-form__label">
            Thumbnail do Evento
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              disabled={uploading}
            />
          </label>

          {form.thumbnail_url && (
            <div className="event-form__image-preview">
              <img src={form.thumbnail_url} alt="Thumbnail" />
            </div>
          )}
        </div>

        {/* Background video */}
        <div className="event-form__image-upload">
          <label className="event-form__label">
            Background em Vídeo (opcional)
            <input
              type="file"
              accept="video/*"
              onChange={handleBackgroundVideoUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Galeria */}
        <div className="event-form__gallery-upload">
          <label className="event-form__label">
            Fotos da Galeria (Upload máximo: 10 fotos por vez)
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
              disabled={uploading}
              max={10}
            />
          </label>

          {form.photos?.length > 0 && (
            <div className="event-form__gallery-preview">
              {form.photos.map((url, i) => (
                <div key={url || i} className="event-form__gallery-item">
                  <img src={url} alt={`Foto ${i + 1}`} />
                  <button
                    type="button"
                    className="event-form__gallery-delete"
                    onClick={() => deleteGalleryPhoto(url)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <button
        className="event-form__submit"
        type="submit"
        disabled={saving || uploading}
      >
        {saving ? "Salvando..." : event ? "Salvar Alterações" : "Criar Evento"}
      </button>
    </form>
  );
};

export default EventForm;
