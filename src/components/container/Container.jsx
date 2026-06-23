function Container({ children }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-dark-950">
      <div className="grow w-full max-w-7xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}

export default Container;
