import { ImageWithFallback } from './ImageWithFallback';

interface TestimonialCardProps {
  name: string;
  company: string;
  testimonial: string;
  imageUrl: string;
  logoUrl?: string;
}

export function TestimonialCard({ name, company, testimonial, imageUrl, logoUrl }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
          <ImageWithFallback 
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        {logoUrl && (
          <div className="w-20 h-20 flex items-center justify-center">
            <ImageWithFallback 
              src={logoUrl}
              alt="Company logo"
              className="max-w-full max-h-full object-contain opacity-40 px-[0px] py-[-7px] mx-[0px] my-[4px] mt-[4px] mr-[0px] mb-[24px] ml-[0px]"
            />
          </div>
        )}
      </div>
      
      <div className="text-[rgb(130,130,130)] text-6xl mb-[-22px] font-[Akaya_Kanadaka] text-[64px] px-[0px] py-[-9px] mt-[-10px] mr-[0px] ml-[0px]">"</div>
      
      <p className="text-gray-700 leading-relaxed mb-8 flex-grow">
        {testimonial}
      </p>
      
      <div className="mt-auto">
        <div className="h-0.5 w-16 bg-gradient-to-br from-brand-purple via-brand-purple/90 to-brand-coral mb-4"></div>
        <p className="text-gray-900 font-medium">{name}</p>
        <p className="text-gray-500 text-sm mt-1">{company}</p>
      </div>
    </div>
  );
}