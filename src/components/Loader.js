function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader"></div>
      <p style={{ color: "white", marginTop: "10px" }}>Loading...</p>
    </div>
  );
}

export default Loader;