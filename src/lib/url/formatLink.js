function formatLink(url) {
  if (!url) return "#";

  const cleanUrl = url.trim();

  // 1️⃣ Se for um link interno absoluto (/events/x)
  if (cleanUrl.startsWith("/")) {
    return `${window.location.origin}${cleanUrl}`;
  }

  // 2️⃣ Se for um caminho interno relativo (events/x)
  if (!cleanUrl.includes("://") && !cleanUrl.startsWith("www.")) {
    return `${window.location.origin}/${cleanUrl}`;
  }

  // 3️⃣ Se já é HTTP/HTTPS (link externo completo)
  if (/^https?:\/\//i.test(cleanUrl)) {
    return cleanUrl;
  }

  // 4️⃣ Se for algo como "instagram.com/blablabla"
  return `https://${cleanUrl}`;
}

export default formatLink;
