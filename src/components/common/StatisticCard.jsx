import "../../styles/components/StatisticCard.css";

function StatisticCard({ title, value }) {
  return (
    <article className="card estadistica-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </article>
  );
}

export default StatisticCard;
