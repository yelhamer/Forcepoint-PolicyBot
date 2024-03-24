import './Help.css';

function Help() {
  return (
    <div className="help-body">
      <h1>Welcome to using PolicyGen!</h1>
      <h2>Getting started</h2>
      <ul>
        <li>Use your Forcepoint-firewall to collect traffic logs from your network.</li>
        <li>
          On the <mark class="PolicyGen"> PolicyGen </mark> home page, click the Browse-button
          <mark class="nmbr"> (1) </mark>
          to select the traffic log file.
        </li>
        <li>
          Wait for <mark class="PolicyGen"> PolicyGen </mark> to generate firewall rules tailored
          for your network. This might take a while depending on the file size.
        </li>
        <li>
          Click the Export-button <mark class="nmbr">(2) </mark> to export the generated firewall
          rules. The exported rule file can be imported into a Forcepoint management console to
          start using the generated firewall rules.
        </li>
      </ul>
      <img
        src=".\help-page-imgs\PolGenHomePage.png"
        alt="PolicyGen home page with the browse button circled in red"
        width="70%"
      />
      <img
        src=".\help-page-imgs\PolGenRuleView.png"
        alt="PolicyGen ruleview page with the export button circled in red"
        width="70%"
      />
      <h2>Editing the generated rules</h2>
      <ul>
        <li>
          Use <mark class="PolicyGen"> PolicyGen </mark> to generate personalised firewall rules as
          described above.
        </li>
        <li>
          You can change the ordering of the rules by moving the rule to the very top or bottom of
          the list <mark class="nmbr">(3) </mark>, or moving the rule one place up or down
          <mark class="nmbr"> (4)</mark>
        </li>
        <li>
          You can edit the source and destination addresses in the eidtable fields
          <mark class="nmbr"> (5) </mark> or add new sources or destinations to a single rule with
          an add-button <mark class="nmbr">(6)</mark>
        </li>
        <li>
          You can choose the Service from a drop-down list <mark class="nmbr">(7)</mark>
        </li>
        <li>
          You can add more services or remove them from a single rule with add and remove buttons
          <mark class="nmbr"> (8)</mark>
        </li>
        <li>
          You can change the action of the rule (e.g. allow/block) by clicking the drop-down list
          <mark class="nmbr"> (9)</mark>
        </li>
        <li>
          You can duplicate a rule <mark class="nmbr">(10) </mark> if you want another rule with
          slight deviations, or add a completely new rule with the Add rule -button
          <mark class="nmbr"> (12)</mark>
        </li>
        <li>
          You can also delete rules with the delete-button <mark class="nmbr">(11)</mark>
        </li>
      </ul>
    </div>
  );
}

export default Help;
