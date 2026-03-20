import { useState } from "react";
import { FaUser, FaBirthdayCake, FaMapMarkerAlt, FaEnvelope, FaGlobe, FaGithub, FaInstagram, FaTwitter, FaLinkedin, FaFacebook, FaTiktok, FaYoutube, FaDiscord, FaTelegram, FaTwitch, FaSpotify, FaMedium, FaBehance, FaDribbble, FaPinterest, FaReddit } from "react-icons/fa";

const predefinedInterests = ["Singing","Dancing","Reading","Gaming","Traveling","Photography","Writing","Music","Movies","Art","Fitness"];
const predefinedHobbies = ["Sports","Cooking","Traveling","Gardening","Yoga","Meditation","Gaming","Volunteering","Blogging","Photography"];
const predefinedSkills = ["Coding","Design","Marketing","Writing","Photography","Video Editing","UI/UX","Public Speaking","Management","Social Media"];

export default function Home() {
  const [form, setForm] = useState({
    username: "",
    name: "",
    dob: "",
    location: "",
    aboutme: {
      bio: "",
      interests: [],
      hobbies: [],
      skills: []
    },
    avatar: "",
    socialProfiles: {
      email: "", whatsapp: "", instagram: "", facebook: "", github: "",
      snapchat: "", youtube: "", twitter: "", linkedin: "", tiktok: "",
      discord: "", telegram: "", twitch: "", spotify: "", medium: "",
      devto: "", behance: "", dribbble: "", pinterest: "", reddit: "",
      threads: "", bluesky: ""
    },
    links: []
  });

  const [newLink, setNewLink] = useState({ title: "", url: "" });

  const handleSocialChange = (platform, value) => {
    setForm({ ...form, socialProfiles: { ...form.socialProfiles, [platform]: value } });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_CLOUDINARY_PRESET");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      { method: "POST", body: formData }
    );
    const data = await res.json();
    setForm({ ...form, avatar: data.secure_url });
  };

  const addLink = () => {
    if (newLink.title && newLink.url) {
      setForm({ ...form, links: [...form.links, { ...newLink, id: Date.now() }] });
      setNewLink({ title: "", url: "" });
    }
  };

  const removeLink = (id) => {
    setForm({ ...form, links: form.links.filter(l => l.id !== id) });
  };

  const toggleTag = (type, tag) => {
    const current = form.aboutme[type];
    setForm({
      ...form,
      aboutme: {
        ...form.aboutme,
        [type]: current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.error);
  };

  const socialPlatforms = [
    { platform: "email", icon: <FaEnvelope /> }, { platform: "whatsapp", icon: <FaGlobe /> },
    { platform: "instagram", icon: <FaInstagram /> }, { platform: "facebook", icon: <FaFacebook /> },
    { platform: "twitter", icon: <FaTwitter /> }, { platform: "github", icon: <FaGithub /> },
    { platform: "linkedin", icon: <FaLinkedin /> }, { platform: "tiktok", icon: <FaTiktok /> },
    { platform: "youtube", icon: <FaYoutube /> }, { platform: "discord", icon: <FaDiscord /> },
    { platform: "telegram", icon: <FaTelegram /> }, { platform: "twitch", icon: <FaTwitch /> },
    { platform: "spotify", icon: <FaSpotify /> }, { platform: "medium", icon: <FaMedium /> },
    { platform: "behance", icon: <FaBehance /> }, { platform: "dribbble", icon: <FaDribbble /> },
    { platform: "pinterest", icon: <FaPinterest /> }, { platform: "reddit", icon: <FaReddit /> }
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>Create Your Profile</h1>
      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div style={{ padding: 20, border: "1px solid #eaeaea", borderRadius: 10, marginBottom: 20 }}>
          <h2>Basic Info</h2>
          <div><FaUser /> <input placeholder="Username" required onChange={e=>setForm({...form, username:e.target.value})} /></div>
          <div><FaUser /> <input placeholder="Full Name" required onChange={e=>setForm({...form, name:e.target.value})} /></div>
          <div><FaBirthdayCake /> <input type="date" onChange={e=>setForm({...form, dob:e.target.value})} /></div>
          <div><FaMapMarkerAlt /> <input placeholder="Location" onChange={e=>setForm({...form, location:e.target.value})} /></div>
          <div>
            <label>Avatar</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {form.avatar && <img src={form.avatar} alt="avatar" width={100} style={{borderRadius:"50%"}} />}
          </div>
        </div>

        {/* About Me with Tags */}
        <div style={{ padding: 20, border: "1px solid #eaeaea", borderRadius: 10, marginBottom: 20 }}>
          <h2>About Me</h2>
          <textarea placeholder="Bio" rows={3} onChange={e=>setForm({...form, aboutme:{...form.aboutme, bio:e.target.value}})} style={{width:"100%",marginBottom:10}} />

          <div>
            <h4>Interests</h4>
            {predefinedInterests.map(tag => (
              <span key={tag} onClick={()=>toggleTag("interests", tag)} style={{
                cursor:"pointer",
                padding:"5px 10px",
                margin:5,
                borderRadius:20,
                backgroundColor: form.aboutme.interests.includes(tag) ? "#0070f3":"#eee",
                color: form.aboutme.interests.includes(tag) ? "white":"black"
              }}>{tag}</span>
            ))}
          </div>

          <div>
            <h4>Hobbies</h4>
            {predefinedHobbies.map(tag => (
              <span key={tag} onClick={()=>toggleTag("hobbies", tag)} style={{
                cursor:"pointer",
                padding:"5px 10px",
                margin:5,
                borderRadius:20,
                backgroundColor: form.aboutme.hobbies.includes(tag) ? "#0070f3":"#eee",
                color: form.aboutme.hobbies.includes(tag) ? "white":"black"
              }}>{tag}</span>
            ))}
          </div>

          <div>
            <h4>Skills</h4>
            {predefinedSkills.map(tag => (
              <span key={tag} onClick={()=>toggleTag("skills", tag)} style={{
                cursor:"pointer",
                padding:"5px 10px",
                margin:5,
                borderRadius:20,
                backgroundColor: form.aboutme.skills.includes(tag) ? "#0070f3":"#eee",
                color: form.aboutme.skills.includes(tag) ? "white":"black"
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Social Profiles */}
        <div style={{ padding: 20, border: "1px solid #eaeaea", borderRadius: 10, marginBottom: 20 }}>
          <h2>Social Profiles</h2>
          {socialPlatforms.map(p => (
            <div key={p.platform} style={{ display:"flex", alignItems:"center", marginBottom:10 }}>
              <span style={{marginRight:10}}>{p.icon}</span>
              <input placeholder={p.platform} value={form.socialProfiles[p.platform]} onChange={e=>handleSocialChange(p.platform,e.target.value)} style={{flex:1}} />
            </div>
          ))}
        </div>

        {/* Custom Links */}
        <div style={{ padding: 20, border: "1px solid #eaeaea", borderRadius: 10, marginBottom: 20 }}>
          <h2>Custom Links</h2>
          <input placeholder="Link Title" value={newLink.title} onChange={e=>setNewLink({...newLink,title:e.target.value})} />
          <input placeholder="URL" value={newLink.url} onChange={e=>setNewLink({...newLink,url:e.target.value})} />
          <button type="button" onClick={addLink}>Add Link</button>
          <ul>
            {form.links.map(l=><li key={l.id}>{l.title} - {l.url} <button type="button" onClick={()=>removeLink(l.id)}>Remove</button></li>)}
          </ul>
        </div>

        <button type="submit" style={{width:"100%", padding:12, background:"#0070f3", color:"white"}}>Create Profile</button>
      </form>
    </div>
  );
}