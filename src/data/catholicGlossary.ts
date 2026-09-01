import { GlossaryEntry } from '../types';

export const CURATED_CATHOLIC_GLOSSARY: GlossaryEntry[] = [
  {
    id: 'transubstantiation',
    term: 'Transubstantiation',
    latinOrGreek: 'Transubstantiatio (Latin: trans- "change" + substantia "substance")',
    category: 'sacraments',
    definition: 'The scholastic theological term dogmatically defined by the Fourth Lateran Council and the Council of Trent, expressing the miraculous change of the entire substance of bread and wine into the Body, Blood, Soul, and Divinity of Jesus Christ in the Holy Eucharist, while the accidental empirical properties (appearances) remain.',
    catechismRef: 'CCC §1376',
    scriptureOrPatristicRef: 'St. Thomas Aquinas, Summa Theologiae III, q. 75; Council of Trent, Session XIII, c. 4; John 6:51-56',
    theologicalContext: 'Central to Catholic Eucharistic dogma, affirming Christ\'s Real Presence against purely symbolic or consubstantiation interpretations.',
    source: 'curated'
  },
  {
    id: 'homoousios',
    term: 'Homoousios (Consubstantial)',
    latinOrGreek: 'ὁμοούσιος (Greek: homo- "same" + ousia "substance/essence"); Latin: Consubstantialis',
    category: 'dogma',
    definition: 'Affirms that the Son is of one and the same divine essence or being with the Father. Formulated at the First Council of Nicaea (AD 325) to refute Arianism, which claimed the Son was a created being.',
    catechismRef: 'CCC §242, §465',
    scriptureOrPatristicRef: 'Council of Nicaea (325); St. Athanasius, Contra Arianos; John 10:30 ("I and the Father are one")',
    theologicalContext: 'Foundational Trinitarian dogma recited in the Nicene-Constantinopolitan Creed ("consubstantial with the Father").',
    source: 'curated'
  },
  {
    id: 'hypostatic-union',
    term: 'Hypostatic Union',
    latinOrGreek: 'Unio Hypostatica (Greek: hypostasis "underlying person/substance")',
    category: 'dogma',
    definition: 'The theological term defined at the Council of Chalcedon (AD 451) designating the mysterious union of the two complete and distinct natures—one fully divine and one fully human—in the single divine Person (Hypostasis) of Jesus Christ, without confusion, change, division, or separation.',
    catechismRef: 'CCC §466-468',
    scriptureOrPatristicRef: 'Council of Chalcedon (451); St. Cyril of Alexandria; Philippians 2:6-8; John 1:14',
    theologicalContext: 'The core Christological doctrine ensuring both Christ\'s true divinity to redeem us and true humanity to represent us.',
    source: 'curated'
  },
  {
    id: 'theotokos',
    term: 'Theotokos (Mother of God)',
    latinOrGreek: 'Θεοτόκος (Greek: Theos "God" + tokos "bearer/bringer forth"); Latin: Deipara / Mater Dei',
    category: 'dogma',
    definition: 'The dogmatic title of the Blessed Virgin Mary solemnly defined by the Council of Ephesus (AD 431). Because Jesus Christ is a single divine Person with two natures, Mary, giving birth to this divine Person according to His humanity, is truly the Mother of God.',
    catechismRef: 'CCC §495, §509',
    scriptureOrPatristicRef: 'Council of Ephesus (431); St. Cyril of Alexandria; Luke 1:43 ("the mother of my Lord")',
    theologicalContext: 'Fundamentally a Christological safeguard: denying Mary as Theotokos divides Christ into two separate persons.',
    source: 'curated'
  },
  {
    id: 'ex-cathedra',
    term: 'Ex Cathedra',
    latinOrGreek: 'Latin: "from the chair" (cathedra: bishop\'s teaching seat)',
    category: 'dogma',
    definition: 'Refers to when the Pope speaks officially in his capacity as supreme pastor and teacher of all Christians, and solemnly defines a doctrine concerning faith or morals to be held by the whole Church. Such pronouncements possess papal infallibility under the guidance of the Holy Spirit.',
    catechismRef: 'CCC §891',
    scriptureOrPatristicRef: 'First Vatican Council, Dogmatic Constitution Pastor Aeternus (1870); Matthew 16:18-19; Luke 22:32',
    theologicalContext: 'Exercised in the formal definitions of the Immaculate Conception (1854) and Assumption of Mary (1950).',
    source: 'curated'
  },
  {
    id: 'mysterium-fidei',
    term: 'Mysterium Fidei',
    latinOrGreek: 'Latin: "The Mystery of Faith"',
    category: 'liturgy',
    definition: 'The liturgical proclamation made by the priest immediately following the Consecration of the bread and wine at Holy Mass, calling upon the faithful to acclaim the central mystery of Christ\'s passion, resurrection, and second coming.',
    catechismRef: 'CCC §1327',
    scriptureOrPatristicRef: 'Pope St. Paul VI, Encyclical Mysterium Fidei (1965); 1 Timothy 3:9, 3:16',
    theologicalContext: 'Also the title of Paul VI\'s 1965 encyclical affirming traditional Eucharistic terminology against modern errors.',
    source: 'curated'
  },
  {
    id: 'lex-orandi-lex-credendi',
    term: 'Lex Orandi, Lex Credendi',
    latinOrGreek: 'Latin: "The law of prayer is the law of faith" (shortened from Prosper of Aquitaine)',
    category: 'latin_phrases',
    definition: 'An ancient theological principle stating that the Church\'s liturgical prayer expresses and shapes her doctrinal faith; how the Church prays reflects and confirms what the Church believes.',
    catechismRef: 'CCC §1124',
    scriptureOrPatristicRef: 'Prosper of Aquitaine (5th century), Indiculus; Pope Pius XII, Mediator Dei (1947)',
    theologicalContext: 'Shows that sacred liturgy is not merely decorative ceremony but an intrinsic witness to apostolic dogma.',
    source: 'curated'
  },
  {
    id: 'ex-opere-operato',
    term: 'Ex Opere Operato',
    latinOrGreek: 'Latin: "by the work worked" / "from the performance of the act itself"',
    category: 'sacraments',
    definition: 'The Catholic sacramental dogma that the sacraments act objectively by virtue of the saving work of Christ accomplished once and for all, and not by the subjective holiness of the administering minister or recipient (though the recipient\'s disposition affects the fruition of grace received).',
    catechismRef: 'CCC §1128',
    scriptureOrPatristicRef: 'Council of Trent, Session VII, Canon 8; St. Augustine, De Baptismo',
    theologicalContext: 'Guarantees the certainty of sacramental grace across all valid administrations.',
    source: 'curated'
  },
  {
    id: 'magisterium',
    term: 'Magisterium',
    latinOrGreek: 'Latin: magister "teacher/master"',
    category: 'dogma',
    definition: 'The living teaching authority of the Catholic Church, entrusted solely to the Pope and the bishops in communion with him, whose task is to authentically interpret and protect the Word of God found in Sacred Scripture and Sacred Tradition.',
    catechismRef: 'CCC §85-87, §888-892',
    scriptureOrPatristicRef: 'Second Vatican Council, Dei Verbum §10; Lumen Gentium §25; 1 Timothy 3:15',
    theologicalContext: 'Divided into Ordinary and Universal Magisterium and Extraordinary Magisterium (Ecumenical Councils & Ex Cathedra).',
    source: 'curated'
  },
  {
    id: 'dei-verbum',
    term: 'Dei Verbum (Word of God)',
    latinOrGreek: 'Latin: "Word of God"',
    category: 'patristics',
    definition: 'The Dogmatic Constitution on Divine Revelation promulgated by Pope St. Paul VI at the Second Vatican Council (1965), elucidating how Scripture and Tradition form one sacred deposit of the Word of God committed to the Church.',
    catechismRef: 'CCC §80-84, §101-141',
    scriptureOrPatristicRef: 'Second Vatican Council (1965); 2 Thessalonians 2:15; Hebrews 1:1-2',
    theologicalContext: 'One of the most consequential conciliar documents on biblical inspiration, inerrancy, and theological interpretation.',
    source: 'curated'
  },
  {
    id: 'sensus-fidelium',
    term: 'Sensus Fidelium (Sense of the Faithful)',
    latinOrGreek: 'Latin: sensus "sense/instinct" + fidelium "of the faithful"',
    category: 'dogma',
    definition: 'The supernatural appreciation of faith on the part of the whole people of God, when, guided by the Magisterium, the universal body of believers manifests an unfailing consensus in matters of faith and morals under the guidance of the Holy Spirit.',
    catechismRef: 'CCC §92, §889',
    scriptureOrPatristicRef: 'Second Vatican Council, Lumen Gentium §12; International Theological Commission (2014)',
    theologicalContext: 'A gift of the Holy Spirit to the baptized, not reducible to sociological public opinion.',
    source: 'curated'
  },
  {
    id: 'filioque',
    term: 'Filioque',
    latinOrGreek: 'Latin: "and from the Son"',
    category: 'dogma',
    definition: 'The clause inserted into the Latin text of the Nicene-Constantinopolitan Creed asserting that the Holy Spirit proceeds eternally from the Father "and the Son" (a Patre Filioque procedit) as from one single principle.',
    catechismRef: 'CCC §246-248',
    scriptureOrPatristicRef: 'Council of Toledo (589); Council of Florence (1439); St. Augustine, De Trinitate; John 15:26',
    theologicalContext: 'A historic theological discussion point between the Western Catholic and Eastern Orthodox traditions.',
    source: 'curated'
  },
  {
    id: 'anaphora',
    term: 'Anaphora (Eucharistic Prayer)',
    latinOrGreek: 'ἀναφορά (Greek: "carrying back / offering up"); Latin: Canon Missae',
    category: 'liturgy',
    definition: 'The central and culminating prayer of the Holy Sacrifice of the Mass, extending from the Preface Dialogue through the Sanctus, Epiclesis, Words of Consecration, Anamnesis, Intercessions, and final Doxology.',
    catechismRef: 'CCC §1352-1354',
    scriptureOrPatristicRef: 'General Instruction of the Roman Missal §78-79; St. Justin Martyr, First Apology',
    theologicalContext: 'The heart of liturgical action in both Western and Eastern Rites.',
    source: 'curated'
  },
  {
    id: 'epiclesis',
    term: 'Epiclesis',
    latinOrGreek: 'ἐπίκλησις (Greek: "invocation / calling down from on high")',
    category: 'liturgy',
    definition: 'The prayer in which the priest implores God the Father to send His Holy Spirit upon the gifts of bread and wine so that they may become the Body and Blood of Christ, and upon the assembly that they may be united in one body.',
    catechismRef: 'CCC §1105, §1353',
    scriptureOrPatristicRef: 'St. John Chrysostom, De Sacerdotio; Eucharistic Prayers I-IV',
    theologicalContext: 'Highlights the trinitarian dynamic of the sacramental action through the power of the Holy Spirit.',
    source: 'curated'
  },
  {
    id: 'imprimatur',
    term: 'Imprimatur',
    latinOrGreek: 'Latin: "Let it be printed"',
    category: 'canon_law',
    definition: 'The official declaration by a Catholic bishop granting permission to print or publish a book or work on Catholic faith or morals, signifying that it is free from doctrinal or moral error.',
    catechismRef: 'Code of Canon Law (CIC), Can. 822-832',
    scriptureOrPatristicRef: 'Code of Canon Law (1983); Apostolic Constitution Pastor Bonus',
    theologicalContext: 'Preceded by the Nihil Obstat ("Nothing hinders") issued by the appointed theological censor.',
    source: 'curated'
  },
  {
    id: 'nihil-obstat',
    term: 'Nihil Obstat',
    latinOrGreek: 'Latin: "Nothing hinders / stands in the way"',
    category: 'canon_law',
    definition: 'The official certification given by a designated diocesan theological censor (censor librorum) stating that a book or manuscript contains nothing contrary to Catholic faith or morals.',
    catechismRef: 'Code of Canon Law (CIC), Can. 830',
    scriptureOrPatristicRef: 'CIC Can. 830 §1-3',
    theologicalContext: 'The prerequisite canonical review before the Diocesan Bishop may grant the Imprimatur.',
    source: 'curated'
  },
  {
    id: 'ipso-facto',
    term: 'Ipso Facto',
    latinOrGreek: 'Latin: "by the fact itself" (latae sententiae)',
    category: 'canon_law',
    definition: 'A canonical term describing an effect or penalty (such as automatic excommunication) that occurs automatically by the very commission of a specific illicit act, without requiring a formal judicial sentence.',
    catechismRef: 'CCC §1463, §2272',
    scriptureOrPatristicRef: 'Code of Canon Law (CIC), Can. 1314, 1398',
    theologicalContext: 'Applies to specific grave canonical delicts such as procuring an abortion or apostasy.',
    source: 'curated'
  },
  {
    id: 'sanctifying-grace',
    term: 'Sanctifying Grace (Gratia Habitualis)',
    latinOrGreek: 'Gratia Sanctificans (Latin: gratia "gift/grace" + sanctificare "to make holy")',
    category: 'dogma',
    definition: 'The stable, supernatural disposition infused by God into the soul at Baptism, by which we are healed of sin, made partakers of the divine nature (theosis), and constituted adopted children of God in the state of grace.',
    catechismRef: 'CCC §1996-2000',
    scriptureOrPatristicRef: 'Council of Trent, Decree on Justification; 2 Peter 1:4; Romans 5:5; 2 Corinthians 5:17',
    theologicalContext: 'Distinct from actual grace, which is an intermittent divine assistance for specific good deeds.',
    source: 'curated'
  },
  {
    id: 'viaticum',
    term: 'Viaticum',
    latinOrGreek: 'Latin: "provision for a journey" (via: road/way)',
    category: 'sacraments',
    definition: 'Holy Communion administered to a dying Catholic Christian as food and spiritual strength for the final journey from this earthly life into eternity.',
    catechismRef: 'CCC §1524-1525',
    scriptureOrPatristicRef: 'First Council of Nicaea (325), Canon 13; John 6:54',
    theologicalContext: 'Conferred along with Anointing of the Sick and Apostolic Pardon as the Last Rites.',
    source: 'curated'
  },
  {
    id: 'doctor-of-the-church',
    term: 'Doctor of the Church (Doctor Ecclesiae)',
    latinOrGreek: 'Latin: doctor "teacher" (from docere "to teach")',
    category: 'patristics',
    definition: 'A title granted by the Pope or an Ecumenical Council to a deceased saint recognized for eminent learning, profound holiness, and outstanding contribution to the defense, explanation, and development of Catholic doctrine.',
    catechismRef: 'CCC §888',
    scriptureOrPatristicRef: 'Examples: St. Augustine, St. Thomas Aquinas, St. Teresa of Ávila, St. Thérèse of Lisieux (37 Doctors to date)',
    theologicalContext: 'Requires three criteria: eminent doctrine (eminens doctrina), high degree of sanctity (insignis vitae sanctitas), and papal proclamation.',
    source: 'curated'
  },
  {
    id: 'typology',
    term: 'Typology (Biblical Typology)',
    latinOrGreek: 'τύπος (Greek: typos "mark, figure, pattern, impression")',
    category: 'scripture',
    definition: 'A method of biblical interpretation recognizing that persons, events, and institutions in the Old Testament (the "types" or figures) prefigure and foreshadow the greater realities fulfilled in Christ and the New Covenant (the "antitypes").',
    catechismRef: 'CCC §128-130',
    scriptureOrPatristicRef: 'St. Augustine ("The New Testament is concealed in the Old, and the Old is revealed in the New"); 1 Corinthians 10:6, 11; Romans 5:14',
    theologicalContext: 'Crucial for reading Scripture with Patristic and Catholic unity, such as Melchizedek prefiguring Christ\'s Eucharistic priesthood.',
    source: 'curated'
  },
  {
    id: 'indulgence',
    term: 'Indulgence (Indulgentia)',
    latinOrGreek: 'Latin: indulgentia "concession, remission, pardon"',
    category: 'moral',
    definition: 'A remission before God of the temporal punishment due to sins whose guilt has already been forgiven in Confession, which the faithful Christian obtains under prescribed conditions through the action of the Church as minister of redemption from the Treasury of Merits.',
    catechismRef: 'CCC §1471-1479',
    scriptureOrPatristicRef: 'Pope St. Paul VI, Apostolic Constitution Indulgentiarum Doctrina (1967); Matthew 16:19; Colossians 1:24',
    theologicalContext: 'Can be partial or plenary; applicable either to oneself or to souls suffering in Purgatory.',
    source: 'curated'
  },
  {
    id: 'anathema-sit',
    term: 'Anathema Sit',
    latinOrGreek: 'ἀνάθεμα (Greek: "set apart / dedicated to destruction"); Latin: "let him be anathema"',
    category: 'canon_law',
    definition: 'A formal formula historically employed by Ecumenical Councils and solemn papal decrees to condemn a specific theological heresy, signaling that anyone holding or obstinately preaching that error is severed from communion with the Church.',
    catechismRef: 'Council of Trent Canons; Galatians 1:8-9',
    scriptureOrPatristicRef: 'Galatians 1:8 ("If anyone preach a gospel to you other than that which you have received, let him be anathema")',
    theologicalContext: 'Used extensively at Trent and Vatican I to establish unambiguous dogmatic boundaries.',
    source: 'curated'
  },
  {
    id: 'patristics',
    term: 'Patristics / Church Fathers',
    latinOrGreek: 'Latin: pater "father"',
    category: 'patristics',
    definition: 'The branch of theological study devoted to the life, writings, doctrine, and historical impact of the early Christian teachers and Church Fathers from the close of the Apostolic Age (c. 100 AD) to St. John of Damascus (d. 749) in the East and St. Isidore of Seville (d. 636) in the West.',
    catechismRef: 'CCC §688, §1124',
    scriptureOrPatristicRef: 'St. Vincent of Lérins, Commonitorium (434); St. Clement of Rome, St. Ignatius of Antioch, St. Irenaeus, St. Augustine',
    theologicalContext: 'The Fathers bear irreplaceable witness to the living Apostolic Tradition and early interpretation of Sacred Scripture.',
    source: 'curated'
  }
];

export function findCuratedTerm(query: string): GlossaryEntry | undefined {
  if (!query || !query.trim()) return undefined;
  const clean = query.trim().toLowerCase();
  
  // Exact match
  const exact = CURATED_CATHOLIC_GLOSSARY.find(entry => 
    entry.term.toLowerCase() === clean || 
    entry.id.toLowerCase() === clean ||
    (entry.latinOrGreek && entry.latinOrGreek.toLowerCase().includes(clean))
  );
  if (exact) return exact;

  // Substring or keyword match
  return CURATED_CATHOLIC_GLOSSARY.find(entry => 
    entry.term.toLowerCase().includes(clean) ||
    clean.includes(entry.term.toLowerCase()) ||
    (entry.latinOrGreek && entry.latinOrGreek.toLowerCase().includes(clean))
  );
}
