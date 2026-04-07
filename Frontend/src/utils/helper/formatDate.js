const formatDate = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);

    // console.log(diff);

    if (diff < 60) return "Just now";
    if (diff < 120) return "1 min ago";
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 7200) return "1 hr ago";
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    if (diff < 172800) return "1 day ago";
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 1209600) return "1 week ago";
    if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
    if (diff < 5184000) return "1 month ago";
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
    return `${Math.floor(diff / 31536000)} years ago`;
};

export default formatDate;