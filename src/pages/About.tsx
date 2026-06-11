export default function About() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>About DhikrPulse</h1>

        <p style={styles.text}>
          DhikrPulse is a simple app designed to help users keep track of daily
          dhikr (remembrance of Allah) and adhkar in a clean, distraction-free interface.
        </p>

        <p style={styles.text}>
          Special thanks to Mahfuza.
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    backgroundColor: "#f7f7f7",
    padding: "20px",
  },
  card: {
    maxWidth: "600px",
    border: "2px solid #333",
    borderRadius: "12px",
    padding: "24px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  title: {
    marginBottom: "12px",
    fontSize: "28px",
    borderBottom: "2px solid #ddd",
    paddingBottom: "8px",
  },
  text: {
    fontSize: "16px",
    lineHeight: "1.6",
    marginTop: "12px",
  },
};