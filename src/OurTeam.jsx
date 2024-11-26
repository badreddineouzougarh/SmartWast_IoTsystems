import React from 'react';
import './OurTeam.css';

const teamMembers = [
    { id: 1, name: 'Assat Fatima', image: 'WhatsApp Image 2024-02-12 at 22.14.32.jpeg', email: 'assat@example.com' },
    { id: 2, name: 'ELBoubekri Fatima Ezzahrae', image: 'WhatsApp Image 2024-02-12 at 23.34.26.jpeg', email: 'ezzahrae@example.com' },
    { id: 3, name: 'El kaddouri Fatiha', image: 'WhatsApp Image 2024-02-12 at 23.34.26 (1).jpeg', email: 'fatiha@example.com' },
    { id: 4, name: 'El Mouh Kaoutar', image: 'WhatsApp Image 2024-02-12 at 23.34.26 (4).jpeg', email: 'kaoutar@example.com' },
    { id: 5, name: 'Elmoussaoui siham', image: 'WhatsApp Image 2024-02-12 at 23.34.26 (3).jpeg', email: 'elmoussaouisiham@iav.ac.ma' },
    { id: 6, name: 'Ouzougarh Bader Eddine', image: 'Ouzogagh.jpeg', email: 'bader@example.com' },
    { id: 7, name: 'Rachidi Ilyas', image: 'WhatsApp Image 2024-02-12 at 23.34.26 (2).jpeg', email: 'rachidii.ilyas@gmail.com' },
];
function OurTeam() {
    return (
        <div className="our-team-container">
            <h2 className="team-title">Our Team</h2>
            <div className="team-members">
                <div className="team-row">
                    {teamMembers.slice(0, 3).map((member) => (
                        <div key={member.id} className="team-member">
                            <img
                                src={`/public/${member.image}`}
                                alt={member.name}
                                className="team-member-img"
                                style={{ width: '200px', height: '200px', borderRadius: '50%' }}
                            />
                            <p>{member.name}</p>
                            <p>Email: {member.email}</p>
                        </div>
                    ))}
                </div>
                <div className="team-row">
                    {teamMembers.slice(3, 6).map((member) => (
                        <div key={member.id} className="team-member">
                            <img
                                src={`/public/${member.image}`}
                                alt={member.name}
                                className="team-member-img"
                                style={{ width: '200px', height: '200px', borderRadius: '50%' }}
                            />
                            <p>{member.name}</p>
                            <p>Email: {member.email}</p>
                        </div>
                    ))}
                </div>
                <div className="team-row">
                    {/* Nouvelle image seule */}
                    <div key={teamMembers[6].id} className="team-member">
                        <img
                            src={`/public/${teamMembers[6].image}`}
                            alt={teamMembers[6].name}
                            className="team-member-img"
                            style={{ width: '200px', height: '200px', borderRadius: '50%' }}
                        />
                        <p>{teamMembers[6].name}</p>
                        <p>Email: {teamMembers[6].email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OurTeam;
