import { MessageCircleCodeIcon } from "lucide-react";
import BorderAnimatedContainer from "../BorderAnimatedContainer";
import AuthImagePanel from "./AuthImagePanel";

interface AuthPageLayoutProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  footerTitle: string;
  footerTags: string[];
  children: React.ReactNode;
}

function AuthPageLayout({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  footerTitle,
  footerTags,
  children,
}: AuthPageLayoutProps) {
  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-800px h-650px">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* Form Column – left */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                {/* Heading */}
                <div className="text-center mb-8">
                  <MessageCircleCodeIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    {title}
                  </h2>
                  <p className="text-slate-400">{subtitle}</p>
                </div>

                {/* Page-specific form + footer */}
                {children}
              </div>
            </div>

            {/* Image Panel – right */}
            <AuthImagePanel
              src={imageSrc}
              alt={imageAlt}
              footerTitle={footerTitle}
              footerTags={footerTags}
            />
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default AuthPageLayout;
