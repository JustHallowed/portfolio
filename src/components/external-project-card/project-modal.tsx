import { useEffect, useRef } from 'react';
import { MdClose, MdOpenInNew } from 'react-icons/md';
import { SanitizedExternalProject } from '../../interfaces/sanitized-config';
import Markdown from './markdown';
import { ProjectScreenshot, ProjectVideo } from './media';

// Write-ups referenced by `detailsFile`, bundled at build time
const DETAIL_FILES = import.meta.glob<string>('/project-details/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

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
  const detailsFromFile = project?.detailsFile
    ? DETAIL_FILES[`/project-details/${project.detailsFile}`]
    : undefined;
  if (project?.detailsFile && detailsFromFile === undefined) {
    console.error(
      `Project details file not found: project-details/${project.detailsFile}`,
    );
  }
  const details =
    detailsFromFile || project?.details || project?.description || '';

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
            {videos.map((video, index) => (
              <ProjectVideo
                key={index}
                url={video}
                title={`${project.title} video ${index + 1}`}
              />
            ))}

            {details.trim() && <Markdown>{details}</Markdown>}

            {screenshots.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {screenshots.map((screenshot, index) => (
                  <ProjectScreenshot
                    key={index}
                    url={screenshot}
                    alt={`${project.title} screenshot ${index + 1}`}
                  />
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
