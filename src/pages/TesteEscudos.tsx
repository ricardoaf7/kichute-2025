import { useEffect, useState } from "react";

export default function TesteEscudos() {
  const [times, setTimes] = useState([]);
  const [timeSelecionado, setTimeSelecionado] = useState(null);

  useEffect(() => {
    fetch("/times.json")
      .then(res => res.json())
      .then(data => setTimes(data));
  }, []);

  const handleSelect = (e) => {
    const nome = e.target.value;
    const time = times.find(t => t.nome === nome);
    setTimeSelecionado(time);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Selecione o time</h2>
      <select onChange={handleSelect}>
        <option value="">-- Escolha --</option>
        {times.map(time => (
          <option key={time.nome} value={time.nome}>
            {time.nome}
          </option>
        ))}
      </select>

      {timeSelecionado && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={timeSelecionado.escudo}
            alt={timeSelecionado.nome}
            width={80}
            height={80}
          />
          <p>{timeSelecionado.nome}</p>
        </div>
      )}
    </div>
  );
}
