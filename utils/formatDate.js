const formatDate = (date) => {
  const d = new Date(date);
  const dtf = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  const [
    { value: Dmonth },
    ,
    { value: Ddate },
    ,
    { value: Dyear },
  ] = dtf.formatToParts(d);
  return `${Ddate} ${Dmonth}, ${Dyear}`;
};

export default formatDate;
