function CloseIconSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function CloseIcon() {
  return (
    <div
      style={{
        height: '24px',
        width: '24px',
        padding: '0',
      }}
    >
      <CloseIconSvg />
    </div>
  );
}
