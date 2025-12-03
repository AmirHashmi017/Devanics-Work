type ProfileCertificationsProps = {
  user: {
    certifications?: string[];
  };
};

export function ProfileCertifications({ user }: ProfileCertificationsProps) {
  const certs = user?.certifications || [];

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-[#1d2026]">CERTIFICATIONS</h2>
      {certs.length === 0 ? (
        <p className="text-[#6e7485]">No certifications available.</p>
      ) : (
        <ul className="list-disc pl-5 text-[#1d2026] space-y-2">
          {certs.map((c, idx) => (
            <li key={`${c}-${idx}`}>{c}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
