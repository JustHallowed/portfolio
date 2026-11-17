import { Fragment, useEffect, useRef } from 'react';
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

  // Fall back to a single "View Project" button when no buttons are configured
  const buttons = project?.buttons?.length
    ? project.buttons
    : project?.link
      ? [{ label: 'View Project', url: project.link }]
      : [];
  const videos = project?.videos ?? [];
  const screenshots = project?.screenshots ?? [];
  const paragraphs = (project?.details || project?.description || '')
    .split(/\n\s*\n/)
    // Join wrapped lines so multi-line template literals read as one paragraph
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').trim())
    .filter((paragraph) => paragraph.length > 0);

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      {/* Content only mounts while open, so closing stops any playing video */}
      {project && (
        <div className="modal-box w-11/12 max-w-4xl bg-base-100 p-0">
          <div className="sticky top-0 z-10 bg-base-100 border-b border-base-300 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
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
            {buttons.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {buttons.map((button, index) => (
                  <a
                    key={index}
                    className={`btn btn-sm ${index === 0 ? 'btn-primary' : 'btn-outline'}`}
                    href={button.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {button.label}
                    <MdOpenInNew />
                  </a>
                ))}
              </div>
            )}
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
                  <p key={index}>
                    {/* `<br>` in the text forces a line break */}
                    {paragraph.split(/\s*<br\s*\/?>\s*/i).map((line, i) => (
                      <Fragment key={i}>
                        {i > 0 && <br />}
                        {line}
                      </Fragment>
                    ))}
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
        </div>
      )}
      <form method="dialog" className="modal-backdrop">
        <button aria-label="Close">close</button>
      </form>
    </dialog>
  );
};

export default ProjectModal;
