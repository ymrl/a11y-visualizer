export const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      position: "absolute",
      width: 1,
      height: 1,
      margin: -1,
      padding: 0,
      clip: "rect(1px, 1px, 1px, 1px)",
      overflow: "hidden",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);
