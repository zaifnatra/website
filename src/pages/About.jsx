import ultra from '../assets/ultra.JPG';
import salkantay from '../assets/salkantay.JPG';
import salkantay2 from '../assets/salkantay2.JPG';
import cat from '../assets/cat.jpg';
import camp from '../assets/camp.jpeg';
import golf from '../assets/golf.JPG';

const Section = ({ title, content, images }) => (
    <div style={{ marginBottom: '5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>{title}</h3>
        {content}
        {images && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                {images.map((img, idx) => (
                    <div key={idx} style={{ height: '300px', overflow: 'hidden', borderRadius: '4px' }}>
                        <img src={img} alt="Adventure" style={{ width: '60%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="hover-scale" />
                    </div>
                ))}
            </div>
        )}
    </div>
);

const About = ({ id }) => {
    return (
        <div id={id} style={{ scrollMarginTop: '100px', paddingTop: '2rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '3rem', letterSpacing: '-1px' }}>about me</h2>

            <Section
                title="hello"
                content={
                    <div style={{ fontSize: '1.1rem', color: '#444' }}>
                        <p style={{ marginBottom: '1rem' }}>i'm a software engineering student who loves creating websites and applications. i enjoy working with different technologies and learning new things every day.</p>
                        <p style={{ marginBottom: '1rem' }}>my journey started a few years ago when i first discovered programming. since then, i've been building various projects and improving my skills constantly.</p>
                        <p>when i'm not coding, i have a pretty active lifestyle and diverse interests that keep me busy!</p>
                    </div>
                }
            />

            <Section
                title="ultra marathon running"
                content={<p style={{ fontSize: '1.1rem', color: '#444' }}>i'm passionate about ultra marathon running. my personal record is 75km in 12 hours in backyard format, which means running the same loop over and over until you hit the distance. it's as mental as it is physical!</p>}
                images={[ultra]}
            />

            <Section
                title="peru adventure"
                content={<p style={{ fontSize: '1.1rem', color: '#444' }}>one of my most memorable experiences was hiking the salkantay trek in peru. the scenery was absolutely incredible, but what made it special was the amazing people i met along the way.</p>}
                images={[salkantay, salkantay2]}
            />

            <Section
                title="outdoor activities"
                content={<p style={{ fontSize: '1.1rem', color: '#444' }}>adirondacks high peaks or whether it's fishing at a quiet lake, hiking through trails, or camping under the stars.</p>}
                images={[cat, camp]}
            />

        </div>
    );
};

export default About;
