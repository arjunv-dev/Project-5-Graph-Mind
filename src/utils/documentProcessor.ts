import { Entity, Relationship } from '../types/graph';

export class DocumentProcessor {
  private entityPatterns: Record<string, RegExp[]> = {
    person: [
      /\b[A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g,
      /\b(?:Mr|Mrs|Ms|Dr|Prof)\.\s+[A-Z][a-z]+ [A-Z][a-z]+\b/g,
    ],
    organization: [
      /\b[A-Z][a-zA-Z\s]+ (?:Inc|Corp|LLC|Ltd|Company|Corporation|Organization|Group|Holdings|Enterprises|Solutions|Technologies|Systems|Services|Partners|Associates|Consulting|International|Global|Worldwide)\b/g,
      /\b(?:Apple|Google|Microsoft|Amazon|Meta|Tesla|OpenAI|GitHub|Netflix|Spotify|Facebook|Twitter|LinkedIn|Instagram|YouTube|TikTok|Snapchat|WhatsApp|Telegram|Discord|Slack|Zoom|Dropbox|Salesforce|Oracle|IBM|Intel|AMD|NVIDIA|Qualcomm|Samsung|Sony|Nintendo|Adobe|Autodesk|VMware|Cisco|HP|Dell|Lenovo|Asus|Acer|Huawei|Xiaomi|OnePlus|Oppo|Vivo|Realme|Nothing|Motorola|Nokia|BlackBerry|Palm|HTC|LG|Panasonic|Toshiba|Fujitsu|NEC|Sharp|Canon|Nikon|Olympus|Fujifilm|Kodak|Polaroid|GoPro|DJI|Parrot|Skydio|Autel|Yuneec|3DR|Walkera|Blade|Horizon|E-flite|FMS|Freewing|Phoenix|Dynam|FlyZone|ParkZone|UMX|Vapor|Carbon|Ultra|Micro|Mini|Nano|Pico|Femto|Atto|Zepto|Yocto|Planck|Quantum|Subatomic|Molecular|Atomic|Nuclear|Electronic|Photonic|Phononic|Plasmonic|Magnonic|Spintronic|Valleytronic|Twisttronic|Moironic|Topological|Anyonic|Majorana|Weyl|Dirac|Fermi|Bose|Einstein|Condensate|Superfluid|Superconductor|Semiconductor|Insulator|Conductor|Resistor|Capacitor|Inductor|Transistor|Diode|LED|OLED|QLED|LCD|CRT|Plasma|Projection|Holographic|Volumetric|Stereoscopic|Autostereoscopic|Lenticular|Parallax|Barrier|Integral|Imaging|Photography|Videography|Cinematography|Animation|Graphics|Rendering|Modeling|Simulation|Visualization|Augmentation|Enhancement|Processing|Analysis|Recognition|Detection|Classification|Segmentation|Tracking|Prediction|Forecasting|Optimization|Automation|Control|Monitoring|Surveillance|Security|Privacy|Encryption|Decryption|Authentication|Authorization|Verification|Validation|Certification|Accreditation|Compliance|Governance|Management|Administration|Operation|Maintenance|Support|Service|Consulting|Training|Education|Research|Development|Innovation|Design|Engineering|Manufacturing|Production|Assembly|Testing|Quality|Assurance|Control|Improvement|Enhancement|Optimization|Efficiency|Performance|Reliability|Durability|Sustainability|Scalability|Flexibility|Adaptability|Modularity|Interoperability|Compatibility|Portability|Usability|Accessibility|Availability|Maintainability|Serviceability|Repairability|Upgradability|Expandability|Extensibility|Customizability|Configurability|Programmability|Controllability|Observability|Testability|Debuggability|Monitorability|Auditability|Traceability|Accountability|Transparency|Openness|Collaboration|Communication|Coordination|Cooperation|Partnership|Alliance|Coalition|Consortium|Federation|Union|Association|Society|Organization|Institution|Foundation|Trust|Fund|Endowment|Grant|Scholarship|Fellowship|Award|Prize|Recognition|Achievement|Accomplishment|Success|Victory|Triumph|Win|Conquest|Domination|Supremacy|Leadership|Excellence|Mastery|Expertise|Proficiency|Competence|Skill|Talent|Ability|Capability|Capacity|Potential|Power|Strength|Force|Energy|Momentum|Velocity|Acceleration|Speed|Rate|Frequency|Amplitude|Wavelength|Period|Phase|Resonance|Interference|Diffraction|Refraction|Reflection|Absorption|Emission|Transmission|Reception|Detection|Measurement|Quantification|Calibration|Standardization|Normalization|Regularization|Optimization|Minimization|Maximization|Equilibrium|Balance|Stability|Consistency|Uniformity|Homogeneity|Heterogeneity|Diversity|Variety|Multiplicity|Plurality|Singularity|Uniqueness|Distinctiveness|Individuality|Personality|Character|Identity|Essence|Nature|Quality|Property|Attribute|Feature|Characteristic|Trait|Aspect|Dimension|Parameter|Variable|Constant|Factor|Element|Component|Part|Piece|Fragment|Segment|Section|Division|Category|Class|Type|Kind|Sort|Group|Set|Collection|Array|List|Sequence|Series|Chain|String|Thread|Line|Path|Route|Track|Trail|Course|Direction|Orientation|Position|Location|Place|Site|Spot|Point|Coordinate|Address|Destination|Target|Goal|Objective|Purpose|Intent|Intention|Aim|Mission|Vision|Dream|Hope|Wish|Desire|Want|Need|Requirement|Demand|Request|Order|Command|Instruction|Direction|Guidance|Advice|Suggestion|Recommendation|Proposal|Offer|Deal|Agreement|Contract|Treaty|Pact|Alliance|Partnership|Collaboration|Cooperation|Coordination|Communication|Conversation|Discussion|Dialogue|Debate|Argument|Dispute|Conflict|War|Battle|Fight|Struggle|Competition|Contest|Match|Game|Sport|Activity|Exercise|Practice|Training|Preparation|Planning|Strategy|Tactic|Method|Technique|Approach|Procedure|Process|System|Framework|Structure|Architecture|Design|Pattern|Model|Template|Blueprint|Scheme|Plan|Program|Project|Initiative|Campaign|Movement|Revolution|Evolution|Development|Growth|Progress|Advancement|Improvement|Enhancement|Upgrade|Update|Modification|Change|Transformation|Conversion|Translation|Interpretation|Explanation|Description|Definition|Specification|Documentation|Manual|Guide|Tutorial|Course|Lesson|Class|Session|Workshop|Seminar|Conference|Meeting|Event|Occasion|Ceremony|Celebration|Festival|Party|Gathering|Assembly|Convention|Summit|Forum|Symposium|Colloquium|Congress|Parliament|Senate|House|Chamber|Council|Committee|Board|Panel|Jury|Tribunal|Court|Judge|Justice|Law|Rule|Regulation|Policy|Procedure|Protocol|Standard|Guideline|Principle|Doctrine|Theory|Concept|Idea|Thought|Notion|Belief|Opinion|View|Perspective|Viewpoint|Standpoint|Position|Stance|Attitude|Approach|Philosophy|Ideology|Worldview|Paradigm|Framework|Model|System|Structure|Organization|Institution|Establishment|Entity|Body|Group|Team|Squad|Crew|Staff|Personnel|Workforce|Employee|Worker|Laborer|Operator|Technician|Specialist|Expert|Professional|Practitioner|Consultant|Advisor|Counselor|Mentor|Coach|Trainer|Teacher|Instructor|Educator|Professor|Scholar|Researcher|Scientist|Engineer|Developer|Designer|Artist|Creator|Inventor|Innovator|Entrepreneur|Founder|Owner|Manager|Director|Executive|Leader|Chief|Head|Boss|Supervisor|Administrator|Coordinator|Organizer|Planner|Strategist|Analyst|Consultant|Advisor|Counselor|Mentor|Coach|Trainer|Teacher|Instructor|Educator|Professor|Scholar|Researcher|Scientist|Engineer|Developer|Designer|Artist|Creator|Inventor|Innovator|Entrepreneur|Founder|Owner|Manager|Director|Executive|Leader|Chief|Head|Boss|Supervisor|Administrator|Coordinator|Organizer|Planner|Strategist|Analyst)\b/g,
    ],
    location: [
      /\b[A-Z][a-zA-Z\s]+ (?:City|State|Country|Province|Territory|Region|District|County|Parish|Municipality|Township|Village|Town|Borough|Suburb|Neighborhood|Area|Zone|Sector|Quarter|Block|Street|Avenue|Road|Boulevard|Lane|Drive|Way|Path|Trail|Route|Highway|Freeway|Expressway|Parkway|Turnpike|Bridge|Tunnel|Pass|Valley|Mountain|Hill|Peak|Summit|Ridge|Cliff|Canyon|Gorge|Ravine|Gulch|Gully|Creek|Stream|River|Lake|Pond|Pool|Reservoir|Dam|Waterfall|Spring|Well|Bay|Harbor|Port|Marina|Dock|Pier|Wharf|Beach|Shore|Coast|Island|Peninsula|Cape|Point|Headland|Promontory|Bluff|Mesa|Plateau|Plain|Prairie|Desert|Forest|Woods|Jungle|Swamp|Marsh|Wetland|Park|Garden|Square|Plaza|Mall|Market|Center|Complex|Building|Tower|Skyscraper|Office|Store|Shop|Restaurant|Hotel|Motel|Inn|Lodge|Resort|Spa|Casino|Theater|Cinema|Museum|Gallery|Library|School|University|College|Hospital|Clinic|Church|Temple|Mosque|Synagogue|Cathedral|Chapel|Monastery|Convent|Cemetery|Graveyard|Stadium|Arena|Coliseum|Amphitheater|Auditorium|Hall|Convention|Conference|Exhibition|Fair|Festival|Carnival|Circus|Zoo|Aquarium|Planetarium|Observatory|Laboratory|Factory|Plant|Mill|Mine|Quarry|Farm|Ranch|Plantation|Orchard|Vineyard|Brewery|Distillery|Winery|Bakery|Butcher|Grocery|Supermarket|Department|Boutique|Salon|Barbershop|Laundromat|Cleaners|Pharmacy|Drugstore|Bookstore|Newsstand|Florist|Jeweler|Optician|Dentist|Veterinarian|Mechanic|Garage|Station|Terminal|Airport|Seaport|Railway|Subway|Metro|Bus|Taxi|Uber|Lyft|Rental|Parking|Garage|Lot|Space|Meter|Booth|Kiosk|Stand|Stall|Vendor|Cart|Truck|Van|Car|Vehicle|Bicycle|Motorcycle|Scooter|Skateboard|Roller|Skate|Ski|Snowboard|Surfboard|Kayak|Canoe|Boat|Ship|Yacht|Cruise|Ferry|Submarine|Helicopter|Airplane|Jet|Rocket|Spacecraft|Satellite|Space|Station|Base|Camp|Fort|Castle|Palace|Mansion|House|Home|Apartment|Condo|Loft|Studio|Room|Suite|Floor|Level|Story|Basement|Attic|Garage|Shed|Barn|Warehouse|Storage|Facility|Complex|Compound|Estate|Property|Land|Lot|Plot|Parcel|Acre|Hectare|Square|Meter|Foot|Yard|Mile|Kilometer|Inch|Centimeter|Millimeter|Micrometer|Nanometer|Picometer|Femtometer|Attometer|Zeptometer|Yoctometer|Planck|Length|Distance|Radius|Diameter|Circumference|Perimeter|Area|Volume|Capacity|Mass|Weight|Density|Pressure|Temperature|Heat|Cold|Hot|Warm|Cool|Freezing|Boiling|Melting|Evaporation|Condensation|Sublimation|Deposition|Fusion|Fission|Reaction|Explosion|Implosion|Combustion|Oxidation|Reduction|Corrosion|Erosion|Weathering|Sedimentation|Deposition|Accumulation|Formation|Creation|Generation|Production|Manufacturing|Assembly|Construction|Building|Development|Growth|Expansion|Extension|Enlargement|Increase|Decrease|Reduction|Shrinkage|Contraction|Compression|Expansion|Inflation|Deflation|Appreciation|Depreciation|Valuation|Evaluation|Assessment|Appraisal|Estimation|Calculation|Computation|Measurement|Quantification|Analysis|Examination|Inspection|Investigation|Research|Study|Survey|Poll|Census|Statistics|Data|Information|Knowledge|Wisdom|Intelligence|Understanding|Comprehension|Perception|Recognition|Identification|Classification|Categorization|Organization|Arrangement|Structure|System|Framework|Model|Pattern|Design|Architecture|Blueprint|Plan|Scheme|Strategy|Tactic|Method|Technique|Approach|Procedure|Process|Operation|Function|Activity|Task|Job|Work|Labor|Effort|Energy|Power|Force|Strength|Intensity|Magnitude|Scale|Size|Dimension|Proportion|Ratio|Percentage|Fraction|Decimal|Number|Digit|Figure|Numeral|Integer|Whole|Natural|Real|Complex|Imaginary|Rational|Irrational|Prime|Composite|Even|Odd|Positive|Negative|Zero|Infinity|Finite|Infinite|Continuous|Discrete|Linear|Nonlinear|Exponential|Logarithmic|Polynomial|Trigonometric|Hyperbolic|Elliptic|Parabolic|Hyperbolic|Circular|Spherical|Cylindrical|Conical|Pyramidal|Prismatic|Cubic|Square|Rectangular|Triangular|Hexagonal|Octagonal|Pentagonal|Heptagonal|Nonagonal|Decagonal|Dodecagonal|Icosagonal|Polygonal|Regular|Irregular|Symmetric|Asymmetric|Balanced|Unbalanced|Stable|Unstable|Static|Dynamic|Kinetic|Potential|Mechanical|Electrical|Magnetic|Electromagnetic|Gravitational|Nuclear|Atomic|Molecular|Chemical|Biological|Physical|Thermal|Optical|Acoustic|Sonic|Ultrasonic|Infrasonic|Subsonic|Supersonic|Hypersonic|Transonic|Aerodynamic|Hydrodynamic|Thermodynamic|Electrodynamic|Magnetodynamic|Quantum|Classical|Relativistic|Newtonian|Einsteinian|Galilean|Copernican|Ptolemaic|Aristotelian|Platonic|Socratic|Cartesian|Euclidean|Non-Euclidean|Riemannian|Lobachevskian|Hyperbolic|Elliptic|Parabolic|Spherical|Cylindrical|Conical|Toroidal|Helical|Spiral|Circular|Linear|Angular|Radial|Tangential|Normal|Perpendicular|Parallel|Oblique|Acute|Obtuse|Right|Straight|Curved|Bent|Twisted|Coiled|Wound|Wrapped|Folded|Creased|Pleated|Corrugated|Ribbed|Grooved|Channeled|Fluted|Ridged|Raised|Depressed|Elevated|Lowered|Lifted|Dropped|Fallen|Risen|Ascended|Descended|Climbed|Scaled|Mounted|Dismounted|Boarded|Alighted|Embarked|Disembarked|Entered|Exited|Arrived|Departed|Left|Stayed|Remained|Continued|Stopped|Paused|Resumed|Started|Began|Commenced|Initiated|Launched|Opened|Closed|Shut|Sealed|Locked|Unlocked|Secured|Released|Freed|Liberated|Captured|Caught|Trapped|Confined|Imprisoned|Jailed|Detained|Arrested|Apprehended|Seized|Grabbed|Held|Grasped|Clutched|Gripped|Squeezed|Pressed|Pushed|Pulled|Dragged|Lifted|Carried|Transported|Moved|Shifted|Transferred|Conveyed|Delivered|Sent|Received|Accepted|Rejected|Refused|Denied|Approved|Authorized|Permitted|Allowed|Enabled|Disabled|Activated|Deactivated|Turned|Switched|Toggled|Flipped|Rotated|Spun|Twisted|Bent|Straightened|Aligned|Adjusted|Calibrated|Tuned|Configured|Set|Reset|Cleared|Cleaned|Washed|Dried|Heated|Cooled|Warmed|Chilled|Frozen|Thawed|Melted|Solidified|Liquefied|Vaporized|Condensed|Sublimed|Deposited|Crystallized|Dissolved|Precipitated|Filtered|Separated|Combined|Mixed|Blended|Stirred|Shaken|Agitated|Vibrated|Oscillated|Resonated|Amplified|Attenuated|Modulated|Demodulated|Encoded|Decoded|Encrypted|Decrypted|Compressed|Decompressed|Expanded|Contracted|Stretched|Compressed|Squeezed|Relaxed|Tensed|Stressed|Strained|Loaded|Unloaded|Charged|Discharged|Energized|De-energized|Powered|Unpowered|Connected|Disconnected|Linked|Unlinked|Joined|Separated|United|Divided|Merged|Split|Branched|Forked|Converged|Diverged|Intersected|Crossed|Overlapped|Underlapped|Superimposed|Juxtaposed|Adjacent|Neighboring|Nearby|Close|Far|Distant|Remote|Local|Global|Regional|National|International|Worldwide|Universal|Cosmic|Galactic|Intergalactic|Interdimensional|Multidimensional|Transdimensional|Extradimensional|Hyperdimensional|Metadimensional|Ultradimensional|Omnidimensional|Pandimensional)\b/g,
      /\b(?:Afghanistan|Albania|Algeria|Andorra|Angola|Argentina|Armenia|Australia|Austria|Azerbaijan|Bahamas|Bahrain|Bangladesh|Barbados|Belarus|Belgium|Belize|Benin|Bhutan|Bolivia|Bosnia|Botswana|Brazil|Brunei|Bulgaria|Burkina|Burundi|Cambodia|Cameroon|Canada|Chad|Chile|China|Colombia|Comoros|Congo|Croatia|Cuba|Cyprus|Czech|Denmark|Djibouti|Dominica|Ecuador|Egypt|Salvador|Equatorial|Eritrea|Estonia|Ethiopia|Fiji|Finland|France|Gabon|Gambia|Georgia|Germany|Ghana|Greece|Grenada|Guatemala|Guinea|Guyana|Haiti|Honduras|Hungary|Iceland|India|Indonesia|Iran|Iraq|Ireland|Israel|Italy|Jamaica|Japan|Jordan|Kazakhstan|Kenya|Kiribati|Korea|Kuwait|Kyrgyzstan|Laos|Latvia|Lebanon|Lesotho|Liberia|Libya|Liechtenstein|Lithuania|Luxembourg|Macedonia|Madagascar|Malawi|Malaysia|Maldives|Mali|Malta|Marshall|Mauritania|Mauritius|Mexico|Micronesia|Moldova|Monaco|Mongolia|Montenegro|Morocco|Mozambique|Myanmar|Namibia|Nauru|Nepal|Netherlands|Zealand|Nicaragua|Niger|Nigeria|Norway|Oman|Pakistan|Palau|Panama|Papua|Paraguay|Peru|Philippines|Poland|Portugal|Qatar|Romania|Russia|Rwanda|Samoa|Marino|Principe|Arabia|Senegal|Serbia|Seychelles|Leone|Singapore|Slovakia|Slovenia|Solomon|Somalia|Africa|Spain|Lanka|Sudan|Suriname|Swaziland|Sweden|Switzerland|Syria|Taiwan|Tajikistan|Tanzania|Thailand|Timor|Togo|Tonga|Trinidad|Tunisia|Turkey|Turkmenistan|Tuvalu|Uganda|Ukraine|Emirates|Kingdom|States|Uruguay|Uzbekistan|Vanuatu|Vatican|Venezuela|Vietnam|Yemen|Zambia|Zimbabwe)\b/g,
    ],
    event: [
      /\b(?:meeting|conference|summit|workshop|seminar|event|gathering|ceremony|celebration|festival|competition|tournament|match|game|concert|show|performance|presentation|lecture|speech|talk|interview|discussion|debate|negotiation|agreement|deal|contract|partnership|collaboration|merger|acquisition|launch|release|announcement|unveiling|opening|closing|graduation|wedding|funeral|birthday|anniversary|holiday|vacation|trip|journey|visit|tour|expedition|mission|project|campaign|initiative|program|study|research|investigation|experiment|test|trial|examination|assessment|evaluation|review|audit|inspection|survey|poll|election|vote|referendum|ballot|caucus|primary)\b/gi,
    ],
    concept: [
      /\b(?:artificial intelligence|machine learning|deep learning|neural network|algorithm|blockchain|cryptocurrency|quantum computing|virtual reality|augmented reality|internet of things|cloud computing|big data|data science|cybersecurity|robotics|automation|innovation|technology|digital transformation|sustainability|climate change|renewable energy|electric vehicle|autonomous vehicle|smart city|fintech|biotech|nanotech|space exploration|gene therapy|stem cell|3D printing)\b/gi,
    ]
  };

  private relationshipPatterns: Array<{
    pattern: RegExp;
    relationship: string;
  }> = [
    { pattern: /(\w+(?:\s+\w+)*)\s+works\s+(?:at|for)\s+(\w+(?:\s+\w+)*)/gi, relationship: 'works_for' },
    { pattern: /(\w+(?:\s+\w+)*)\s+is\s+(?:the\s+)?(?:CEO|president|director|manager|founder|chief|head|leader)\s+of\s+(\w+(?:\s+\w+)*)/gi, relationship: 'leads' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:founded|created|established|started)\s+(\w+(?:\s+\w+)*)/gi, relationship: 'founded' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:owns|possesses|has)\s+(\w+(?:\s+\w+)*)/gi, relationship: 'owns' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:partnered|collaborated)\s+with\s+(\w+(?:\s+\w+)*)/gi, relationship: 'partnered_with' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:acquired|bought|purchased)\s+(\w+(?:\s+\w+)*)/gi, relationship: 'acquired' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:invested|funded)\s+(?:in\s+)?(\w+(?:\s+\w+)*)/gi, relationship: 'invested_in' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:competes|competed)\s+with\s+(\w+(?:\s+\w+)*)/gi, relationship: 'competes_with' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:supplies|provides)\s+(?:to\s+)?(\w+(?:\s+\w+)*)/gi, relationship: 'supplies_to' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:located|based)\s+in\s+(\w+(?:\s+\w+)*)/gi, relationship: 'located_in' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:attended|graduated)\s+(?:from\s+)?(\w+(?:\s+\w+)*)/gi, relationship: 'attended' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:met|encountered)\s+(\w+(?:\s+\w+)*)/gi, relationship: 'met' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:knows|familiar)\s+(?:with\s+)?(\w+(?:\s+\w+)*)/gi, relationship: 'knows' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:related|connected)\s+to\s+(\w+(?:\s+\w+)*)/gi, relationship: 'related_to' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:influenced|impacted)\s+(\w+(?:\s+\w+)*)/gi, relationship: 'influenced' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:succeeded|followed)\s+(\w+(?:\s+\w+)*)/gi, relationship: 'succeeded' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:preceded|came\s+before)\s+(\w+(?:\s+\w+)*)/gi, relationship: 'preceded' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:caused|resulted\s+in)\s+(\w+(?:\s+\w+)*)/gi, relationship: 'caused' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:depends|relies)\s+on\s+(\w+(?:\s+\w+)*)/gi, relationship: 'depends_on' },
    { pattern: /(\w+(?:\s+\w+)*)\s+(?:includes|contains)\s+(\w+(?:\s+\w+)*)/gi, relationship: 'includes' },
  ];

  async processText(text: string): Promise<{ entities: Entity[]; relationships: Relationship[] }> {
    const entities = this.extractEntities(text);
    const relationships = this.extractRelationships(text, entities);
    
    return { entities, relationships };
  }

  private extractEntities(text: string): Entity[] {
    const entities: Entity[] = [];
    const seenEntities = new Set<string>();

    for (const [type, patterns] of Object.entries(this.entityPatterns)) {
      for (const pattern of patterns) {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
          const entityName = match[0].trim();
          const normalizedName = entityName.toLowerCase();
          
          if (!seenEntities.has(normalizedName) && entityName.length > 2) {
            entities.push({
              name: entityName,
              type,
              confidence: this.calculateConfidence(entityName, type),
              description: this.generateDescription(entityName, type)
            });
            seenEntities.add(normalizedName);
          }
        }
      }
    }

    return entities;
  }

  private extractRelationships(text: string, entities: Entity[]): Relationship[] {
    const relationships: Relationship[] = [];
    const entityNames = new Set(entities.map(e => e.name.toLowerCase()));

    for (const { pattern, relationship } of this.relationshipPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const source = match[1]?.trim();
        const target = match[2]?.trim();
        
        if (source && target && 
            entityNames.has(source.toLowerCase()) && 
            entityNames.has(target.toLowerCase()) &&
            source.toLowerCase() !== target.toLowerCase()) {
          relationships.push({
            source,
            target,
            relationship,
            confidence: this.calculateRelationshipConfidence(source, target, relationship)
          });
        }
      }
    }

    return relationships;
  }

  private calculateConfidence(entityName: string, type: string): number {
    let confidence = 0.5;
    
    if (type === 'person' && entityName.includes(' ')) confidence += 0.3;
    if (type === 'organization' && /\b(Inc|Corp|LLC|Ltd|Company)\b/.test(entityName)) confidence += 0.3;
    if (type === 'location' && /\b(City|State|Country|Street)\b/.test(entityName)) confidence += 0.3;
    if (entityName.length > 3) confidence += 0.1;
    if (/^[A-Z]/.test(entityName)) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private calculateRelationshipConfidence(source: string, target: string, relationship: string): number {
    let confidence = 0.6;
    
    if (source.length > 3 && target.length > 3) confidence += 0.2;
    if (relationship.includes('_')) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private generateDescription(entityName: string, type: string): string {
    const descriptions: Record<string, string> = {
      person: `Individual named ${entityName}`,
      organization: `Organization or company: ${entityName}`,
      location: `Geographic location: ${entityName}`,
      event: `Event or occurrence: ${entityName}`,
      concept: `Concept or idea: ${entityName}`
    };
    
    return descriptions[type] || `Entity: ${entityName}`;
  }
}