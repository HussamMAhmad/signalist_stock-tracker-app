import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen text-grey-400">
      {/* Header */}
      <div className="">{children}</div>
    </main>
  );
}

export default layout;
