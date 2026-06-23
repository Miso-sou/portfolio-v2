export default function ResumeApp() {
  return (
    <div className="flex flex-col h-full gap-4">
      {/* PDF Container */}
      <div className="flex-1 border-2 border-os-ink bg-os-accent shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)]">
        <iframe 
          src="/resume.pdf" 
          title="Resume"
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
}
