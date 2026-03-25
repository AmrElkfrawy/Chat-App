interface AuthImagePanelProps {
  src: string;
  alt: string;
  footerTitle: string;
  footerTags: string[];
}

function AuthImagePanel({
  src,
  alt,
  footerTitle,
  footerTags,
}: AuthImagePanelProps) {
  return (
    <div className="hidden md:w-1/2 md:flex md:flex-col items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
      <img src={src} alt={alt} className="w-full h-auto object-contain" />
      <div className="mt-6 text-center">
        <h3 className="text-xl font-medium text-cyan-400">{footerTitle}</h3>
        <div className="mt-4 flex justify-center gap-4">
          {footerTags.map((tag, index) => (
            <span key={index} className="auth-badge">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuthImagePanel;
