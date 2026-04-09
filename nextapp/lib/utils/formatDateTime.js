export default function formatDateTime(datetime) {
    const d = new Date(datetime);
    if (isNaN(d)) return '';
    const date = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `${date} | ${time}`;
}