import type { ReactNode } from "react";

interface BaseProps {
  children: ReactNode;
}

const BasePage = ({ children }: BaseProps) => {
  return (
    <>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 bg-white px-10 py-12 flex-1">
        {children}
      </div>
    </>
  );
};

export default BasePage;
