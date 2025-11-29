export default function formattedDate() {
  // Array of weekdays in Portuguese
  const days = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  
  // Array of months in Portuguese
  const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", 
                 "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  const today = new Date(); // Get current date

  const weekDay = days[today.getDay()]; // Get current weekday
  const day = today.getDate(); // Get day of the month
  const month = months[today.getMonth()]; // Get current month
  const year = today.getFullYear(); // Get current year

  return `${weekDay}, ${day} de ${month} de ${year}`; // Return formatted date string
}