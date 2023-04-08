import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import axios from "axios";

const EditProfile = () => {
    const [cookies] = useCookies(null);
    const [formData, setFormData] = useState({
        first_name: "",
        course: "",
        year_of_study: "",
        about: "",
    });
    const [loading, setLoading] = useState(true);
    let navigate = useNavigate()
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/user?userId=${cookies.UserId}`);
                const { first_name, course, year_of_study, about } = response.data;
                setFormData({ first_name, course, year_of_study, about });
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProfileData();
    }, [cookies.UserId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8000/user/${cookies.UserId}`, {
                first_name: formData.first_name,
                course: formData.course,
                year_of_study: formData.year_of_study,
                about: formData.about,
            });
            const success = response.status === 200;
            if (success) navigate('/dashboard');
        } catch (err) {
            console.log(err);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard')
    }
    const handleChange = (e) => {
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        const name = e.target.name;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="editprofile">
            <h2>Update your profile details</h2>
        <form onSubmit={handleSubmit}>
            <label htmlFor="first_name">First Name</label>
            <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
            />
            <label htmlFor="course">Course</label>
            <input
                type="text"
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
            />
            <label htmlFor="year_of_study">Year of Study</label>
            <input
                type="text"
                id="year_of_study"
                name="year_of_study"
                value={formData.year_of_study}
                onChange={handleChange}
            />
            <label htmlFor="about">About</label>
            <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
            />
            <button type="submit">Update Profile</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
        </form>
        </div>
    );
};

export default EditProfile;
