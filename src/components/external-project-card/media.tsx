/**
 * Returns an embeddable URL for YouTube links, or null for anything else.
 */
const getYouTubeEmbedUrl = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );

  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

export const isVideoUrl = (url: string): boolean =>
  getYouTubeEmbedUrl(url) !== null ||
  /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);

/**
 * A YouTube embed or a native video player, depending on the URL.
 */
export const ProjectVideo = ({ url, title }: { url: string; title: string }) => {
  const embedUrl = getYouTubeEmbedUrl(url);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-base-300">
      {embedUrl ? (
        <iframe
          className="w-full h-full"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video className="w-full h-full" src={url} controls />
      )}
    </div>
  );
};

/**
 * A screenshot that opens full size in a new tab when clicked.
 */
export const ProjectScreenshot = ({ url, alt }: { url: string; alt: string }) => (
  <a
    href={url}
    target="_blank"
    rel="noreferrer"
    className="block overflow-hidden rounded-xl border border-base-300"
  >
    <img
      src={url}
      alt={alt}
      loading="lazy"
      className="w-full h-auto transition-transform duration-300 hover:scale-105"
    />
  </a>
);
