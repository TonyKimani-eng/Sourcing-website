export function SectionHeader({
  eyebrow,
  title,
  description,
  inverse = false
}: {
  eyebrow: string;
  title: string;
  description?: string;
  inverse?: boolean;
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className={`text-sm font-bold uppercase ${inverse ? "text-gold-400" : "text-teal-600"}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-3 text-3xl font-black sm:text-4xl ${inverse ? "text-white" : "text-navy-950"}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-4 text-base leading-7 sm:text-lg ${inverse ? "text-white/[0.72]" : "text-slate-600"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
