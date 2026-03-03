import { useCallback, useMemo } from "react";
import formatLink from "../../../../../lib/url/formatLink";

const useEventTicketsCTA = ({ date, ticket_url }) => {
  const hasTickets = Boolean(ticket_url);

  const isPastEvent = useMemo(() => {
    if (!date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(date);
    if (Number.isNaN(eventDate.getTime())) return false;

    eventDate.setHours(0, 0, 0, 0);
    return eventDate < today;
  }, [date]);

  const show = !isPastEvent;

  const onClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!hasTickets) return;

      window.open(formatLink(ticket_url), "_blank", "noopener,noreferrer");
    },
    [hasTickets, ticket_url],
  );

  return {
    show,
    hasTickets,
    disabled: !hasTickets,
    label: hasTickets ? "BUY TICKETS" : "TICKETS SOON",
    onClick,
  };
};

export default useEventTicketsCTA;
