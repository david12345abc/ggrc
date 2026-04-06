import React from 'react';
import './Team.css';

const teamMembers = [
  {
    name: 'Nino Museridze',
    role: 'Founder and Clinical Director of the GGRC',
    image: '/images/team/nino.png',
  },
  {
    name: 'Lilit Karapetyan',
    role: 'Gynecologist-reproductive specialist',
    image: '/images/team/lilit.png',
  },
  {
    name: 'Levon Vardazaryan',
    role: 'Urologist/andrologist',
    image: '/images/team/levon.png',
  },
  {
    name: 'Emma Vasilyan',
    role: 'Ultrasound Specialist',
    image: '/images/team/emma.png',
  },
];

const Team = () => {
  return (
    <section className="team" id="team">
      <div className="container">
        <h2 className="section-title">OUR TEAM</h2>
        <p className="section-subtitle">
          The professional team at GGRC Armenia is Your trusted partner on the
          journey to parenthood
        </p>

        <div className="team__grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team__card">
              <div className="team__card-img">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="team__card-info">
                <h3 className="team__card-name">{member.name}</h3>
                <p className="team__card-role">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
