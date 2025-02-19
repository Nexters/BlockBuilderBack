const { ThirdwebStorage } = require("@thirdweb-dev/storage");
const storage = new ThirdwebStorage({
  secretKey: process.env.THIRD_WEB_STORAGE_KEY,
});

async function getImageFromUri(uri) {
  const response = await fetch(uri);
  const data = await response.json();
  return data.image;
}

const tokenUris = [
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreifbxels4nsejcguljh33dxi26qxwpscz5lxhpo2bwvh4wyqkgip4m",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreic6bjxckaikk6ikewwpdrim5tkdo6oqu74hvgsj3abgvqgthuy3ly",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigdxcwiwdtuj4d3lkezelg6pzdskxe2iz7vgzvvgjk5nq73rhvvd4",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibtpfuvbwd53hjz2cw2uerg5jj4rsztvs5c5tyj6jcmltk7jziosi",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreics5npselbff5npcrxercatxnt6yu6iy3bzvw4qjd6uin3zquvjam",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihdlorwk2ycuehnd25e2vunsnm42ng4sqt6wael7feamy2u3ldghq",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreifear4k5mderdqackmhginopsif5emq65l36bq3i2y4sbmttrzcbu",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreica23cm5fvmpmu6j5j4eijxuvapai4nwtvq3ny5osay6tyiyvjfsq",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreif2wojrzrvi2t2teqsumqwtaqnfdwttlq4yp7agknjx7z7zqkvwxa",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreic4vcqtswij7k5rli5a77vgo5g2xrfh2smxis25wduqhr7wvhz5ci",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiemslfalxickpqnkhlwvusdv2ytukma5i6vg5o5iujy5xcs2zfw2y",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibzynhotuxpuoksc3wzhn4dfz5hhdmcjkevy4canodgdf6zmkcfnu",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiemaxaznssejd4otarpdyuo3lvvohhvg3iukrd74om3s4a3b26n5u",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreib7wt2pops2z3x4sjuz6jg2njrit5id6zt53hb4zpjwt375xesjhu",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicnbby44n4txy55cetwzwj5kkyu4bxtmbdyo6lctrprlagovgzqey",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihbuqoxztgbjei5egbou3x6kr2swahndxvrv2hxmyksq5str62nai",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigfht2mxnaxkq5gvnnpws4vxmahro4cmo45ixjqzpczidts5nmevi",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibzl3etciiblpuuuirlwuwnefdactkox5mje5ejslznwm63hoplve",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreib5bo5abnopatgwkgha6w2r2q42u74tp2skhbs3kqpbzo3bfwgtxa",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreih5nwxafweqme6rmsn6jdmbh7unlq3vktxpltordx3ouxaawdzaam",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihhl2kutwvlio4bkvpqv6zabfq7wsggzcjyx6rpej6gunzcgnh57i",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidgf3sysvtrwcrp5boi5w7tjjv5tkjuqa5f3lwlvftpq4lnmi76se",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiea2rmmt6q7mjonbf6ukyqidiarazev3futmfcmk26bqilika3k5m",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidieqvfhyzh7lixslp5wltwuwiszrgrkvzfr2chjzncmnsagngnpa",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihanfzjyzw4xdxhn4gxbhv6mhkecjvh4vtqqimahirmfjna625rxq",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibh7sn3ngotxlx73o4eqos3z7kutjqgvlqbphjjmichvtztptfmim",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreifldwvyiqn6rbs3fg3vxrwvlu2wvdyguqeqpj343add37inqawwlu",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibnjfxoq5off6lfvksevqqao3emoprhogyyk4zdcpj7qralk3s3cu",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidrh4chjpvma4y52ingvrthttqijqgxd5m4asvfx3bhcefhlicspy",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreifg6pwhr433xbvm2y6nxs5chimdun45nszla2x3prfika6rl5hv4m",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreif37s3pxpswvd6gskquehoul4gnvkzbptynjfigsnathvcoosvc2e",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihrb6p45rbgsmjnt2v4pyzmvsp7jtwik2zk5xn2ridjox6sqsrj3q",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidgem3xido67xx3pt6ngbdqdd6mfcpc24no4bexb5nc7ee4sg7uhi",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigku6kaykbhxudzlmxuketwrpplqowojmlwpzh2elimboxajumoci",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreia3pur6sn6gyhay42z3vdbaurclr57qndmurb6ckcp72tc2hyrowm",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigsn7lzlindqz5y5c2f35ihkpipilf3jkkq6nx7crpgozr6gjg3hy",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicqcj4nh33i4mzg5x3vjpxov6rczzx2b27d7eflqf4cqrnxtgjbye",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidgrpqdhzacyifqi4mhvybqntjynddlxytcwfdv7wjg573kobrdsi",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreia7cfwscbshp4fzajq4wddwdx225s6idc2leisr3pjvrcjpyzbupa",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreid3cf4dhoi5etkfzehmuwlf4uk65scnjq2wafznrrkfyygtteu2nu",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiacdr3xw46wjfu64gn3ngjlhx2nctrh4j4fpvknr6c6takzk2yn5q",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicqelgnzjsrb5sewacm2bsj4pr2avezqsxoa2ei6grtfhbufohehi",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicuuxfp6j3renvnsfxacz6tdsb7fs3orbxppn3v72thie5k6rtcc4",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreievlxfueddboqvgqy5a7va3moemkfed3wynpwezjqlsfbikxrts5m",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiadnnj3wf5wzcxadtturgupa2izn2zr6kmfzmx4lqpjm43cnv5fje",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicq6usie4q5nydku7zzwwgofdt26w4veb3hwfcgnfvldg6vnisoki",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreid7vrvpvuwhli7nu4ouocurt2ysdse53sm65qf47wx3qi6yvhwzge",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreic2pnp5e6hpmersvu23bkshs5rvbx2oynwn3wbjqchffuw7nnsbbm",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiawrkqwbizv3smd3di2siotfdt2mofoqrraxwxmdzbaxpcr7zc72u",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidvv6chgv6xp35bgedktk6tip2m5qsprqwcdnnkatgpcpsd6h5nf4",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreih3vmvag4lkzaf4adgjmmetomzuejqvsmhjedusezwc447kdcr3ka",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicohl4aomd5lt3ajwm2ix7yrj4tt4knyi7myeyddkszoet33hvw5a",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreietrwt4ceafzcosyiazuf2eq5xbyiwaa5s3q4mbxxkhvaxic6bjcy",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihcrnin7memrwrj4maviiutprzrbbvsw5kh75khdgjt5d7uqfvdfu",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiatuzzu2gfsiexhyvfr7mdzty3zml7g2qi2tik7h443gbjcoeo2b4",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiereb3xh5zhilqcrdovpv6s3tmtocpabvgkzelkiz74tftk62u5o4",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicpy6arksson2wtnpi7iqeksbiccyi3wusqne2fjnkx5fwblrseei",
];

const ipfsMapping = {
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreica23cm5fvmpmu6j5j4eijxuvapai4nwtvq3ny5osay6tyiyvjfsq":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigklan4zpicoqkasjlyeyht7myhio7owxzeocgbvq5tvktu752mpa",

  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreic4vcqtswij7k5rli5a77vgo5g2xrfh2smxis25wduqhr7wvhz5ci":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiaebjx6phmlhqsrocsomobk5d4oy2gatgghzn4gle267vpvogi3v4",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreic6bjxckaikk6ikewwpdrim5tkdo6oqu74hvgsj3abgvqgthuy3ly":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafybeibhc4expnhfaegt5dod4x55brhbeyd26hr6is4g6km3vevqdsxtua",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibtpfuvbwd53hjz2cw2uerg5jj4rsztvs5c5tyj6jcmltk7jziosi":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicb3xnecay2qtv6vkkjmtbggw3utu5j6qr4krdvd3xk5ybkui3n7q",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreif2wojrzrvi2t2teqsumqwtaqnfdwttlq4yp7agknjx7z7zqkvwxa":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicr2mcjk6h66b7ms5iblmttaiv4aiouqot2y6dfpdy3yjkm2hoftu",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihdlorwk2ycuehnd25e2vunsnm42ng4sqt6wael7feamy2u3ldghq":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidn5vzfybonoacw7nqqot73hchgf2gwp7frxfbz3aw5wy6yig6ema",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreifear4k5mderdqackmhginopsif5emq65l36bq3i2y4sbmttrzcbu":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreic7ephtdozy3r5at7w7wo2fyspu5jlgbh7zz7ag6o742v5bhsrc7u",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibzynhotuxpuoksc3wzhn4dfz5hhdmcjkevy4canodgdf6zmkcfnu":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafybeigr5argszzztfoqbif2r557jjm74n6oe4dkef6wwhktpsyocaopsm",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreih5nwxafweqme6rmsn6jdmbh7unlq3vktxpltordx3ouxaawdzaam":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreieogb27f5id3zl5v45sifmx2iu476b52tws5ss44lehu6rqg5cppa",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihbuqoxztgbjei5egbou3x6kr2swahndxvrv2hxmyksq5str62nai":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreif3xz4j7vrhfqn25ejfszm4r3dwurlagppggw6q46ktdg6b7eyyem",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidgf3sysvtrwcrp5boi5w7tjjv5tkjuqa5f3lwlvftpq4lnmi76se":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreieum3bgyfrcphbwr5iztx2kczy22m7n6bunyidlm3j7daetnld24e",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihhl2kutwvlio4bkvpqv6zabfq7wsggzcjyx6rpej6gunzcgnh57i":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreialpkfvoeakqqh5erhicwkgds7cvpn7bwbrysbmluhc4tcwr57fsa",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiea2rmmt6q7mjonbf6ukyqidiarazev3futmfcmk26bqilika3k5m":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreia2rkxpnvzfj7eboosa5ef6vduuhjl4bjnndc6qzrhr6v7bki5zum",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreifbxels4nsejcguljh33dxi26qxwpscz5lxhpo2bwvh4wyqkgip4m":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafybeigr5argszzztfoqbif2r557jjm74n6oe4dkef6wwhktpsyocaopsm",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigdxcwiwdtuj4d3lkezelg6pzdskxe2iz7vgzvvgjk5nq73rhvvd4":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreib3tvbg6m2gfbx545qeqjeo6j5lu55y5bf7rp3j5dyqnwlzhyfoiy",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreics5npselbff5npcrxercatxnt6yu6iy3bzvw4qjd6uin3zquvjam":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidh757ifm3kvwm4ne4y3snusa5duee6t37ddhg2x6ydflgz76xquq",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreif37s3pxpswvd6gskquehoul4gnvkzbptynjfigsnathvcoosvc2e":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreif5v3tbvlqakggtabiyeogwzbhp424mchq7qrems7mrjrsne4gzv4",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigfht2mxnaxkq5gvnnpws4vxmahro4cmo45ixjqzpczidts5nmevi":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidxhcfbgx67fdrfsd4omltjrv3sjeyh7lkk7w7c5lwttlvigcuyq4",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigku6kaykbhxudzlmxuketwrpplqowojmlwpzh2elimboxajumoci":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafybeih2nkn3vv74bxwfvmpd6lm4fuv7ycax77erukshsdyempovtgx3dm",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidgem3xido67xx3pt6ngbdqdd6mfcpc24no4bexb5nc7ee4sg7uhi":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreieheh3vejtdlkr43gd5hmxuaquyck4fikdg36ovak5snlncygogqq",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibzl3etciiblpuuuirlwuwnefdactkox5mje5ejslznwm63hoplve":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidbhqhsd3s7x6psi7r6cholxvrvsqqw767u4dp7avdtlzckw7g53m",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiadnnj3wf5wzcxadtturgupa2izn2zr6kmfzmx4lqpjm43cnv5fje":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibwoyo2f6rh3jkbno7xodlyq36hoztkdzo3sximthfjocsenzq6mi",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreib7wt2pops2z3x4sjuz6jg2njrit5id6zt53hb4zpjwt375xesjhu":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiaa2lvi7y65u37lxe3g7ig6f7nh4ufhn2cp7yuurq2osw36j773pa",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreifldwvyiqn6rbs3fg3vxrwvlu2wvdyguqeqpj343add37inqawwlu":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiaxvezuitqlr3bqypb7gkgom45i6tusuwecj2vgaej3yakihr636u",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidgrpqdhzacyifqi4mhvybqntjynddlxytcwfdv7wjg573kobrdsi":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreig5emfomcftq6yzt5mhrbvjh3mnxczwjwqml6s45fpdogczu6kbti",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihrb6p45rbgsmjnt2v4pyzmvsp7jtwik2zk5xn2ridjox6sqsrj3q":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicvprrm3bmcvtfl4woejux3ibavsvrdkcihaap6nv5w7favcf7es4",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidrh4chjpvma4y52ingvrthttqijqgxd5m4asvfx3bhcefhlicspy":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicbpgcokgn62xlvc4jylz4b34jt6jbe3oq7lup7pgonstwt4svafe",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigsn7lzlindqz5y5c2f35ihkpipilf3jkkq6nx7crpgozr6gjg3hy":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihv7vwfpliq4c3ot2bebgaquveehtrwczf7rlb57gb7lnoi5vqeje",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicq6usie4q5nydku7zzwwgofdt26w4veb3hwfcgnfvldg6vnisoki":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigqmes5xnvyg4aevpspqh47jggv54svfx7ebc3gd4am7f4jqitbny",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidieqvfhyzh7lixslp5wltwuwiszrgrkvzfr2chjzncmnsagngnpa":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreifufojdmqukfgmngvwvxjhanjhnocrsilkefzlk7bee5r2wt26e4e",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicnbby44n4txy55cetwzwj5kkyu4bxtmbdyo6lctrprlagovgzqey":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreic54xv2osktc6cm2sjgkpxdxb4c7djrxeenx7c4me7gc5anmhoija",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiemslfalxickpqnkhlwvusdv2ytukma5i6vg5o5iujy5xcs2zfw2y":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreifripriunjiewb5l27q7lenqonhc3yh4brzojanhjoffo5gvlzjiu",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreid3cf4dhoi5etkfzehmuwlf4uk65scnjq2wafznrrkfyygtteu2nu":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreid67ipidulokcv4svwgrrhejfozbush4x25bh4o2bghiwyhpomit4",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreib5bo5abnopatgwkgha6w2r2q42u74tp2skhbs3kqpbzo3bfwgtxa":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidbrtire4zarzvywsmbzjkvwammpkhcva6u33aburcrnygyv5beoi",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihanfzjyzw4xdxhn4gxbhv6mhkecjvh4vtqqimahirmfjna625rxq":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidbmgwkfumo6ryyqd57evmbx2pakozp3c3afdpskyl4zf4dkehjjq",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreievlxfueddboqvgqy5a7va3moemkfed3wynpwezjqlsfbikxrts5m":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidgdmzqoscpixyqwf7fo3xu2q4ogrvnxpyx6l4a2wqu77gp7kzvxu",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreia3pur6sn6gyhay42z3vdbaurclr57qndmurb6ckcp72tc2hyrowm":
    "https://90435dc40a621a9fa78ca7622125cd00.ipfscdn.io/ipfs/bafybeifytrh7nrrrt23zxra37oozfequixkiraqpdehkuaqk6sqa7kcxka/0",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicqelgnzjsrb5sewacm2bsj4pr2avezqsxoa2ei6grtfhbufohehi":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiehdzzdqlqkrjip27yp73ohagcshomhzo3i4yslqauwfwlfnl4iey",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicuuxfp6j3renvnsfxacz6tdsb7fs3orbxppn3v72thie5k6rtcc4":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidyu7nj2j7yfob4sdxovgbsflgimm2rzvh3al5vsdsekyv24fgg4i",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibnjfxoq5off6lfvksevqqao3emoprhogyyk4zdcpj7qralk3s3cu":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihbjgstacpq7e34hefuzmaw4ktf3eclxprayikej6lizc7u37l5iu",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihcrnin7memrwrj4maviiutprzrbbvsw5kh75khdgjt5d7uqfvdfu":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigquwwm5rxi3wszhv5dzkc7wsxshrpz3acaw3kvt2exeuus4km33i",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibh7sn3ngotxlx73o4eqos3z7kutjqgvlqbphjjmichvtztptfmim":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreid5rr2gahbhizd2ljhrdcnzxbltqqcymlrdg5wqfoobc253miwimq",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiacdr3xw46wjfu64gn3ngjlhx2nctrh4j4fpvknr6c6takzk2yn5q":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreia3r5b6erculm4jqpp32wnzy35amyonho3b2dut3af7hmc7lf4hc4",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreid7vrvpvuwhli7nu4ouocurt2ysdse53sm65qf47wx3qi6yvhwzge":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibe76gmo5guocbvlq3zu77fay5tl6ahlq56omzsga3miaquggbpxq",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiereb3xh5zhilqcrdovpv6s3tmtocpabvgkzelkiz74tftk62u5o4":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreifuqrpqvbzfw6hoqmmo7rvg2ydku4exkpf3yvsxqujs7j6jqosacu",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiemaxaznssejd4otarpdyuo3lvvohhvg3iukrd74om3s4a3b26n5u":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidt3kzqenxjw2geccqj5vmbsmv7v45z7e7pkijb2mzi5gw5mra47y",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiawrkqwbizv3smd3di2siotfdt2mofoqrraxwxmdzbaxpcr7zc72u":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreihhr4cwyiglyru6fb3fgkelyuh5nut32ebdeiv3nbsm35rlidx6lq",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreidvv6chgv6xp35bgedktk6tip2m5qsprqwcdnnkatgpcpsd6h5nf4":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigqgzwql65ptzb2bgwftsm7zvdeiipgup3jlho2vp2nf3pzdfxtci",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreih3vmvag4lkzaf4adgjmmetomzuejqvsmhjedusezwc447kdcr3ka":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiaamhxjnlozupfca2dvdnjhxam75ju5eygd3ecv57iixbyabbfjwe",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicohl4aomd5lt3ajwm2ix7yrj4tt4knyi7myeyddkszoet33hvw5a":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiegpj3xrn5f74v7gxuvr5l6nraqawhwnjc75b7f3zdkn6gcqpc3ky",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreic2pnp5e6hpmersvu23bkshs5rvbx2oynwn3wbjqchffuw7nnsbbm":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigidqlkp2yejgjindjm7y5zopdkytceoxjco2niqjoos5zhpzzv5y",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreifg6pwhr433xbvm2y6nxs5chimdun45nszla2x3prfika6rl5hv4m":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreigrqg2zw6modlpdnsnzbhokuoxewvvbbsfyecfdwm67uu6kx4sduq",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreia7cfwscbshp4fzajq4wddwdx225s6idc2leisr3pjvrcjpyzbupa":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicnhijr4dkybqfbp37qjw3fxlodj7rtjyexkrlp4nhyymfgiuucqm",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicpy6arksson2wtnpi7iqeksbiccyi3wusqne2fjnkx5fwblrseei":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiciatkqvipsw3lgjrvnkhmlsegzyf2iafz3mcle4kiekz3cr76ypa",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiatuzzu2gfsiexhyvfr7mdzty3zml7g2qi2tik7h443gbjcoeo2b4":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreifxalniczjt6hbligw36r3xmcmbti3r3zh6mw52dr3fkoqtby57ra",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreietrwt4ceafzcosyiazuf2eq5xbyiwaa5s3q4mbxxkhvaxic6bjcy":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreibo3dzlb44mdlp2unkykrjr7xuik3bzopivexi2ayn3uemgnbi2hq",
  "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreicqcj4nh33i4mzg5x3vjpxov6rczzx2b27d7eflqf4cqrnxtgjbye":
    "https://ivory-holy-bonobo-724.mypinata.cloud/ipfs/bafkreiclz6ctbgv7uu72g3zomidvw7lljgg2rrukzj4wqzwoy7axybthti",
};

function getImageUrlFromMapping(tokenUri) {
  return ipfsMapping[tokenUri] || "";
}

async function convertCid(ipfsUrl) {
  const cidWithPath = ipfsUrl.replace("ipfs://", "");
  const resolvedUrl = `${cidWithPath}`;
  return resolvedUrl;
}

async function ipfsFileUpload(metaData) {
  if (!metaData) {
    throw new Error("Invalid data provided to ipfsFileUpload");
  }
  metaData.image = await storage.resolveScheme(metaData.image);
  const uri = await storage.upload(metaData);
  const resolvedUrl = await storage.resolveScheme(uri);
  return {
    resolvedUrl,
  };
}

const getNetworkProvider = async (network) => {
  switch (network) {
    case "sepolia":
      return process.env.ALCHEMY_SEPOLIA_RPC_NODE_URL;
    case "avalanche":
      return process.env.ALLTHATNODE_AVALANCHE_FUJI_RPC_NODE_URL;
    default:
      return process.env.ALCHEMY_SEPOLIA_RPC_NODE_URL;
  }
};

// IPFS URI와 매칭되는 image URL을 저장할 전역 매핑 객체
const ipfsUriToImageUrl = {};

/**
 * 서버 시작 시 한 번 실행하여 모든 tokenUris에 대해 image URL을 미리 가져와 매핑을 구성한다.
 */
async function prefetchIpfsMapping() {
  await Promise.all(
    tokenUris.map(async (uri) => {
      try {
        const ipfsImg = await getImageFromUri(uri);
        const imageUrl = await convertCid(ipfsImg);
        ipfsUriToImageUrl[uri] = imageUrl;
      } catch (error) {
        console.error(`Error prefetching for ${uri}:`, error);
        ipfsUriToImageUrl[uri] = ""; // 실패 시 빈 문자열 또는 기본값 할당
      }
    })
  );
  console.log("Prefetched IPFS mapping:", ipfsUriToImageUrl);
}

/**
 * 주어진 tokenUri에 대해 미리 구성된 매핑에서 image URL을 바로 반환한다.
 * 만약 매핑에 없으면, 동적으로 가져와 매핑에 저장하고 반환한다.
 */
async function getImageUrlForTokenUri(tokenUri) {
  if (ipfsUriToImageUrl[tokenUri]) {
    return ipfsUriToImageUrl[tokenUri];
  } else {
    try {
      const ipfsImg = await getImageFromUri(tokenUri);
      const imageUrl = await convertCid(ipfsImg);
      ipfsUriToImageUrl[tokenUri] = imageUrl;
      return imageUrl;
    } catch (error) {
      console.error(`Error fetching image for ${tokenUri}:`, error);
      return "";
    }
  }
}

module.exports = {
  ipfsFileUpload,
  getNetworkProvider,
  convertCid,
  getImageFromUri,
  prefetchIpfsMapping,
  getImageUrlForTokenUri,
  getImageUrlFromMapping,
};
