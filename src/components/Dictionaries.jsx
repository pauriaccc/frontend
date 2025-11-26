import Navbar from "./Navbar"
import Header from "./Header"
import { useState, useEffect } from "react";
import Dictionary from "./Dictionary";

function Dictionaries() {
  const [dictionaries, setDictionaries] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/dictionaries/STU005")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setDictionaries(data))
      .catch((error) => {
        console.error("Error fetching dictionaries:", error);
      });
  }, []);

  const dictionaryComponents = dictionaries.map(dictionary => (
    <Dictionary
      key={dictionary.dictionaryId}
      title={dictionary.title}
      content={dictionary.content}
      tags={dictionary.tags}
    />
  ));

  return (
    <>
      <Navbar />
      <Header />
      <div className="main">
        <h1>Dictionaries</h1>
        <div className="dictionary-grid">
            {dictionaryComponents}
        </div>
      </div>
    </>
  );
}

export default Dictionaries;