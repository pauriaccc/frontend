import Navbar from "./Navbar";
import Header from "./Header";
import { useState, useEffect } from "react";
import Journal from "./Journal";

function Journals() {
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/journals/STU001")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => setJournals(data))
      .catch((err) => {
        console.error("Error fetching journals:", err);
      });
  }, []);

  const journalComponents = journals.map((journal) => (
    <Journal
      key={journal.journalId}
      date={journal.createdTs}
      content={journal.content}
      tags={journal.tags}
    />
  ));

  return (
    <>
      <Navbar />
      <Header />
      <div className="main">
        <h1>Journals</h1>
        <div className="journal-grid">
          {journalComponents}
        </div>
      </div>
    </>
  );
}

export default Journals;