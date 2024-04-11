import './About.css';

function About() {
  return (
    <div className="about-body">
      <h1>About PolicyGen</h1>
      <h2>Background</h2>
      <p>
        <mark class="PolicyGen">PolicyGen </mark> is created by six University of Turku Cyber
        Security master's students as a part of the Capstone 2023-2024 course.
      </p>
      <h2>Goal</h2>
      <p>
        <mark class="PolicyGen">PolicyGen </mark> is an application used to automate the generation
        of firewall rules for the Forcepoint Next Generation Firewall. With
        <mark class="PolicyGen"> PolicyGen</mark>, you can import a file containing network traffic
        data, and based on that,<mark class="PolicyGen"> PolicyGen </mark>will generate suitable
        firewall rules. This saves time, as rules no longer need to be written manually, one by one.
      </p>
      <h2>Implementation</h2>
      <p>
        <mark class="PolicyGen">PolicyGen </mark> is built using Python and React. The application
        utilizes a web interface where users can upload their existing network traffic logs in JSON
        format.
      </p>
      <p>
        The traffic file is inspected by the backend, which employs Python code to generate suitable
        firewall rules based on the provided traffic. The traffic file is then sent to the front-end
        web interface where users can modify, add, or delete existing firewall rules.
      </p>
      <p>
        Once users have finished modifying the uploaded traffic file, the modified file can be
        exported as an XML file and saved to the local machine. Users can then upload the newly
        created file into the Forcepoint Next Generation Firewall interface for the firewall rules
        to take effect.
      </p>
    </div>
  );
}

export default About;
