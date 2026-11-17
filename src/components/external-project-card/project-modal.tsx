import { useEffect, useRef } from 'react';
import { MdClose, MdOpenInNew } from 'react-icons/md';
import { SanitizedExternalProject } from '../../interfaces/sanitized-config';

/**
 * Returns an embeddable URL for YouTube links, or null for anything else.
 */
const getYouTubeEmbedUrl = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );

  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const ProjectModal = ({
  project,
  onClose,
}: {
  project: SanitizedExternalProject | null;
  onClose: () => void;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project && !dialog.open) {
      dialog.showModal();
    } else if (!project && dialog.open) {
      dialog.close();
    }
  }, [project]);

  const videos = project?.videos ?? [];
  const screenshots = project?.screenshots ?? [];
  const paragraphs = (project?.details || project?.description || '')
    .split(/\n\s*\n/)
    .filter((paragraph) => paragraph.trim().length > 0);

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      {/* Content only mounts while open, so closing stops any playing video */}
      {project && (
        <div className="modal-box w-11/12 max-w-4xl bg-base-100 p-0">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-base-100 border-b border-base-300 px-6 py-4">
            <h3 className="text-lg font-bold text-base-content">
              {project.title}
            </h3>
            <button
              className="btn btn-sm btn-circle btn-ghost"
              aria-label="Close"
              onClick={() => dialogRef.current?.close()}
            >
              <MdClose className="text-xl" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6">
            {videos.map((video, index) => {
              const embedUrl = getYouTubeEmbedUrl(video);

              return (
                <div
                  key={index}
                  className="aspect-video w-full overflow-hidden rounded-xl bg-base-300"
                >
                  {embedUrl ? (
                    <iframe
                      className="w-full h-full"
                      src={embedUrl}
                      title={`${project.title} video ${index + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video className="w-full h-full" src={video} controls />
                  )}
                </div>
              );
            })}

            {paragraphs.length > 0 && (
              <div className="space-y-3 text-base-content text-sm sm:text-base leading-relaxed">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {screenshots.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {screenshots.map((screenshot, index) => (
                  <a
                    key={index}
                    href={screenshot}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded-xl border border-base-300"
                  >
                    <img
                      src={screenshot}
                      alt={`${project.title} screenshot ${index + 1}`}
                      loading="lazy"
                      className="w-full h-auto transition-transform duration-300 hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>

          {project.link && (
            <div className="sticky bottom-0 flex justify-end bg-base-100 border-t border-base-300 px-6 py-4">
              <a
                className="btn btn-primary btn-sm"
                href={project.link}
                target="_blank"
                rel="noreferrer"
              >
                View Project
                <MdOpenInNew />
              </a>
            </div>
          )}
        </div>
      )}
      <form method="dialog" className="modal-backdrop">
        <button aria-label="Close">close</button>
      </form>
    </dialog>
  );
};

export default ProjectModal;
