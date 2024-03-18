var refactorVisitAudienceLocationData = function(data) {	

	//QLD
  var buyQLDlabels = [];
  var buyQLDinternaltionalData = [];
  var buyQLDwaData = [];
  var buyQLDntData = [];
  var buyQLDsaData = [];
  var buyQLDvicData = [];
  var buyQLDnswData = [];
  var buyQLDqldData = [];
  var buyQLDtasData = [];
  var buyQLDactData = [];

  data.sections.buy.data.QLD.forEach(function(item) {
    buyQLDlabels.push(item.date);
    buyQLDinternaltionalData.push(parseFloat(item['International'].replace("%", "")));
    buyQLDwaData.push(parseFloat(item['WA'].replace("%", "")));
    buyQLDntData.push(parseFloat(item['NT'].replace("%", "")));
    buyQLDsaData.push(parseFloat(item['SA'].replace("%", "")));
    buyQLDvicData.push(parseFloat(item['VIC'].replace("%", "")));
    buyQLDnswData.push(parseFloat(item['NSW'].replace("%", "")));
    buyQLDqldData.push(parseFloat(item['QLD'].replace("%", "")));
    buyQLDtasData.push(parseFloat(item['TAS'].replace("%", "")));
    buyQLDactData.push(parseFloat(item['ACT'].replace("%", "")));
  });
  

  var buyQLDData = {
    labels: buyQLDlabels,
    internaltionalData: buyQLDinternaltionalData,
    waData: buyQLDwaData,
    ntData: buyQLDntData,
    saData: buyQLDsaData,
    vicData: buyQLDvicData,
    nswData: buyQLDnswData,
    qldData: buyQLDqldData,
    tasData: buyQLDtasData,
    actData: buyQLDactData
  }

  var rentQLDlabels = [];
  var rentQLDinternaltionalData = [];
  var rentQLDwaData = [];
  var rentQLDntData = [];
  var rentQLDsaData = [];
  var rentQLDvicData = [];
  var rentQLDnswData = [];
  var rentQLDqldData = [];
  var rentQLDtasData = [];
  var rentQLDactData = [];

  data.sections.rent.data.QLD.forEach(function(item) {
    rentQLDlabels.push(item.date);
    rentQLDinternaltionalData.push(parseFloat(item['International'].replace("%", "")));
    rentQLDwaData.push(parseFloat(item['WA'].replace("%", "")));
    rentQLDntData.push(parseFloat(item['NT'].replace("%", "")));
    rentQLDsaData.push(parseFloat(item['SA'].replace("%", "")));
    rentQLDvicData.push(parseFloat(item['VIC'].replace("%", "")));
    rentQLDnswData.push(parseFloat(item['NSW'].replace("%", "")));
    rentQLDqldData.push(parseFloat(item['QLD'].replace("%", "")));
    rentQLDtasData.push(parseFloat(item['TAS'].replace("%", "")));
    rentQLDactData.push(parseFloat(item['ACT'].replace("%", "")));
  });  

  var rentQLDData = {
    labels: rentQLDlabels,
    internaltionalData: rentQLDinternaltionalData,
    waData: rentQLDwaData,
    ntData: rentQLDntData,
    saData: rentQLDsaData,
    vicData: rentQLDvicData,
    nswData: rentQLDnswData,
    qldData: rentQLDqldData,
    tasData: rentQLDtasData,
    actData: rentQLDactData
  }

  //WA
  var buyWAlabels = [];
  var buyWAinternaltionalData = [];
  var buyWAwaData = [];
  var buyWAntData = [];
  var buyWAsaData = [];
  var buyWAvicData = [];
  var buyWAnswData = [];
  var buyWAqldData = [];
  var buyWAtasData = [];
  var buyWAactData = [];

  data.sections.buy.data.WA.forEach(function(item) {
    buyWAlabels.push(item.date);
    buyWAinternaltionalData.push(parseFloat(item['International'].replace("%", "")));
    buyWAwaData.push(parseFloat(item['WA'].replace("%", "")));
    buyWAntData.push(parseFloat(item['NT'].replace("%", "")));
    buyWAsaData.push(parseFloat(item['SA'].replace("%", "")));
    buyWAvicData.push(parseFloat(item['VIC'].replace("%", "")));
    buyWAnswData.push(parseFloat(item['NSW'].replace("%", "")));
    buyWAqldData.push(parseFloat(item['QLD'].replace("%", "")));
    buyWAtasData.push(parseFloat(item['TAS'].replace("%", "")));
    buyWAactData.push(parseFloat(item['ACT'].replace("%", "")));
  });
  

  var buyWAData = {
    labels: buyWAlabels,
    internaltionalData: buyWAinternaltionalData,
    waData: buyWAwaData,
    ntData: buyWAntData,
    saData: buyWAsaData,
    vicData: buyWAvicData,
    nswData: buyWAnswData,
    qldData: buyWAqldData,
    tasData: buyWAtasData,
    actData: buyWAactData
  }

  var rentWAlabels = [];
  var rentWAinternaltionalData = [];
  var rentWAwaData = [];
  var rentWAntData = [];
  var rentWAsaData = [];
  var rentWAvicData = [];
  var rentWAnswData = [];
  var rentWAqldData = [];
  var rentWAtasData = [];
  var rentWAactData = [];

  data.sections.rent.data.WA.forEach(function(item) {
    rentWAlabels.push(item.date);
    rentWAinternaltionalData.push(parseFloat(item['International'].replace("%", "")));
    rentWAwaData.push(parseFloat(item['WA'].replace("%", "")));
    rentWAntData.push(parseFloat(item['NT'].replace("%", "")));
    rentWAsaData.push(parseFloat(item['SA'].replace("%", "")));
    rentWAvicData.push(parseFloat(item['VIC'].replace("%", "")));
    rentWAnswData.push(parseFloat(item['NSW'].replace("%", "")));
    rentWAqldData.push(parseFloat(item['QLD'].replace("%", "")));
    rentWAtasData.push(parseFloat(item['TAS'].replace("%", "")));
    rentWAactData.push(parseFloat(item['ACT'].replace("%", "")));
  });  

  var rentWAData = {
    labels: rentWAlabels,
    internaltionalData: rentWAinternaltionalData,
    waData: rentWAwaData,
    ntData: rentWAntData,
    saData: rentWAsaData,
    vicData: rentWAvicData,
    nswData: rentWAnswData,
    qldData: rentWAqldData,
    tasData: rentWAtasData,
    actData: rentWAactData
  }

  //NSW
  var buyNSWlabels = [];
  var buyNSWinternaltionalData = [];
  var buyNSWwaData = [];
  var buyNSWntData = [];
  var buyNSWsaData = [];
  var buyNSWvicData = [];
  var buyNSWnswData = [];
  var buyNSWqldData = [];
  var buyNSWtasData = [];
  var buyNSWactData = [];

  data.sections.buy.data.NSW.forEach(function(item) {
    buyNSWlabels.push(item.date);
    buyNSWinternaltionalData.push(parseFloat(item['International'].replace("%", "")));
    buyNSWwaData.push(parseFloat(item['WA'].replace("%", "")));
    buyNSWntData.push(parseFloat(item['NT'].replace("%", "")));
    buyNSWsaData.push(parseFloat(item['SA'].replace("%", "")));
    buyNSWvicData.push(parseFloat(item['VIC'].replace("%", "")));
    buyNSWnswData.push(parseFloat(item['NSW'].replace("%", "")));
    buyNSWqldData.push(parseFloat(item['QLD'].replace("%", "")));
    buyNSWtasData.push(parseFloat(item['TAS'].replace("%", "")));
    buyNSWactData.push(parseFloat(item['ACT'].replace("%", "")));
  });
  

  var buyNSWData = {
    labels: buyNSWlabels,
    internaltionalData: buyNSWinternaltionalData,
    waData: buyNSWwaData,
    ntData: buyNSWntData,
    saData: buyNSWsaData,
    vicData: buyNSWvicData,
    nswData: buyNSWnswData,
    qldData: buyNSWqldData,
    tasData: buyNSWtasData,
    actData: buyNSWactData
  }

  var rentNSWlabels = [];
  var rentNSWinternaltionalData = [];
  var rentNSWwaData = [];
  var rentNSWntData = [];
  var rentNSWsaData = [];
  var rentNSWvicData = [];
  var rentNSWnswData = [];
  var rentNSWqldData = [];
  var rentNSWtasData = [];
  var rentNSWactData = [];

  data.sections.rent.data.NSW.forEach(function(item) {
    rentNSWlabels.push(item.date);
    rentNSWinternaltionalData.push(parseFloat(item['International'].replace("%", "")));
    rentNSWwaData.push(parseFloat(item['WA'].replace("%", "")));
    rentNSWntData.push(parseFloat(item['NT'].replace("%", "")));
    rentNSWsaData.push(parseFloat(item['SA'].replace("%", "")));
    rentNSWvicData.push(parseFloat(item['VIC'].replace("%", "")));
    rentNSWnswData.push(parseFloat(item['NSW'].replace("%", "")));
    rentNSWqldData.push(parseFloat(item['QLD'].replace("%", "")));
    rentNSWtasData.push(parseFloat(item['TAS'].replace("%", "")));
    rentNSWactData.push(parseFloat(item['ACT'].replace("%", "")));
  });  

  var rentNSWData = {
    labels: rentNSWlabels,
    internaltionalData: rentNSWinternaltionalData,
    waData: rentNSWwaData,
    ntData: rentNSWntData,
    saData: rentNSWsaData,
    vicData: rentNSWvicData,
    nswData: rentNSWnswData,
    qldData: rentNSWqldData,
    tasData: rentNSWtasData,
    actData: rentNSWactData
  }

  //ACT
  var buyACTlabels = [];
  var buyACTinternaltionalData = [];
  var buyACTwaData = [];
  var buyACTntData = [];
  var buyACTsaData = [];
  var buyACTvicData = [];
  var buyACTnswData = [];
  var buyACTqldData = [];
  var buyACTtasData = [];
  var buyACTactData = [];

  data.sections.buy.data.ACT.forEach(function(item) {
    buyACTlabels.push(item.date);
    buyACTinternaltionalData.push(parseFloat(item['International'].replace("%", "")));
    buyACTwaData.push(parseFloat(item['WA'].replace("%", "")));
    buyACTntData.push(parseFloat(item['NT'].replace("%", "")));
    buyACTsaData.push(parseFloat(item['SA'].replace("%", "")));
    buyACTvicData.push(parseFloat(item['VIC'].replace("%", "")));
    buyACTnswData.push(parseFloat(item['NSW'].replace("%", "")));
    buyACTqldData.push(parseFloat(item['QLD'].replace("%", "")));
    buyACTtasData.push(parseFloat(item['TAS'].replace("%", "")));
    buyACTactData.push(parseFloat(item['ACT'].replace("%", "")));
  });
  

  var buyACTData = {
    labels: buyACTlabels,
    internaltionalData: buyACTinternaltionalData,
    waData: buyACTwaData,
    ntData: buyACTntData,
    saData: buyACTsaData,
    vicData: buyACTvicData,
    nswData: buyACTnswData,
    qldData: buyACTqldData,
    tasData: buyACTtasData,
    actData: buyACTactData
  }

  var rentACTlabels = [];
  var rentACTinternaltionalData = [];
  var rentACTwaData = [];
  var rentACTntData = [];
  var rentACTsaData = [];
  var rentACTvicData = [];
  var rentACTnswData = [];
  var rentACTqldData = [];
  var rentACTtasData = [];
  var rentACTactData = [];

  data.sections.rent.data.ACT.forEach(function(item) {
    rentACTlabels.push(item.date);
    rentACTinternaltionalData.push(parseFloat(item['International'].replace("%", "")));
    rentACTwaData.push(parseFloat(item['WA'].replace("%", "")));
    rentACTntData.push(parseFloat(item['NT'].replace("%", "")));
    rentACTsaData.push(parseFloat(item['SA'].replace("%", "")));
    rentACTvicData.push(parseFloat(item['VIC'].replace("%", "")));
    rentACTnswData.push(parseFloat(item['NSW'].replace("%", "")));
    rentACTqldData.push(parseFloat(item['QLD'].replace("%", "")));
    rentACTtasData.push(parseFloat(item['TAS'].replace("%", "")));
    rentACTactData.push(parseFloat(item['ACT'].replace("%", "")));
  });  

  var rentACTData = {
    labels: rentACTlabels,
    internaltionalData: rentACTinternaltionalData,
    waData: rentACTwaData,
    ntData: rentACTntData,
    saData: rentACTsaData,
    vicData: rentACTvicData,
    nswData: rentACTnswData,
    qldData: rentACTqldData,
    tasData: rentACTtasData,
    actData: rentACTactData
  }

  //SA
  var buySAlabels = [];
  var buySAinternaltionalData = [];
  var buySAwaData = [];
  var buySAntData = [];
  var buySAsaData = [];
  var buySAvicData = [];
  var buySAnswData = [];
  var buySAqldData = [];
  var buySAtasData = [];
  var buySAactData = [];

  data.sections.buy.data.SA.forEach(function(item) {
    buySAlabels.push(item.date);
    buySAinternaltionalData.push(parseFloat(item['International'].replace("%", "")));
    buySAwaData.push(parseFloat(item['WA'].replace("%", "")));
    buySAntData.push(parseFloat(item['NT'].replace("%", "")));
    buySAsaData.push(parseFloat(item['SA'].replace("%", "")));
    buySAvicData.push(parseFloat(item['VIC'].replace("%", "")));
    buySAnswData.push(parseFloat(item['NSW'].replace("%", "")));
    buySAqldData.push(parseFloat(item['QLD'].replace("%", "")));
    buySAtasData.push(parseFloat(item['TAS'].replace("%", "")));
    buySAactData.push(parseFloat(item['ACT'].replace("%", "")));
  });
  

  var buySAData = {
    labels: buySAlabels,
    internaltionalData: buySAinternaltionalData,
    waData: buySAwaData,
    ntData: buySAntData,
    saData: buySAsaData,
    vicData: buySAvicData,
    nswData: buySAnswData,
    qldData: buySAqldData,
    tasData: buySAtasData,
    actData: buySAactData
  }

  var rentSAlabels = [];
  var rentSAinternaltionalData = [];
  var rentSAwaData = [];
  var rentSAntData = [];
  var rentSAsaData = [];
  var rentSAvicData = [];
  var rentSAnswData = [];
  var rentSAqldData = [];
  var rentSAtasData = [];
  var rentSAactData = [];

  data.sections.rent.data.SA.forEach(function(item) {
    rentSAlabels.push(item.date);
    rentSAinternaltionalData.push(parseFloat(item['International'].replace("%", "")));
    rentSAwaData.push(parseFloat(item['WA'].replace("%", "")));
    rentSAntData.push(parseFloat(item['NT'].replace("%", "")));
    rentSAsaData.push(parseFloat(item['SA'].replace("%", "")));
    rentSAvicData.push(parseFloat(item['VIC'].replace("%", "")));
    rentSAnswData.push(parseFloat(item['NSW'].replace("%", "")));
    rentSAqldData.push(parseFloat(item['QLD'].replace("%", "")));
    rentSAtasData.push(parseFloat(item['TAS'].replace("%", "")));
    rentSAactData.push(parseFloat(item['ACT'].replace("%", "")));
  });  

  var rentSAData = {
    labels: rentSAlabels,
    internaltionalData: rentSAinternaltionalData,
    waData: rentSAwaData,
    ntData: rentSAntData,
    saData: rentSAsaData,
    vicData: rentSAvicData,
    nswData: rentSAnswData,
    qldData: rentSAqldData,
    tasData: rentSAtasData,
    actData: rentSAactData
  }

  //SA
  var buyTASlabels = [];
  var buyTASinternaltionalData = [];
  var buyTASwaData = [];
  var buyTASntData = [];
  var buyTASsaData = [];
  var buyTASvicData = [];
  var buyTASnswData = [];
  var buyTASqldData = [];
  var buyTAStasData = [];
  var buyTASactData = [];

  data.sections.buy.data.TAS.forEach(function(item) {
    buyTASlabels.push(item.date);
    buyTASinternaltionalData.push(parseFloat(item['International'].replace("%", "")));
    buyTASwaData.push(parseFloat(item['WA'].replace("%", "")));
    buyTASntData.push(parseFloat(item['NT'].replace("%", "")));
    buyTASsaData.push(parseFloat(item['SA'].replace("%", "")));
    buyTASvicData.push(parseFloat(item['VIC'].replace("%", "")));
    buyTASnswData.push(parseFloat(item['NSW'].replace("%", "")));
    buyTASqldData.push(parseFloat(item['QLD'].replace("%", "")));
    buyTAStasData.push(parseFloat(item['TAS'].replace("%", "")));
    buyTASactData.push(parseFloat(item['ACT'].replace("%", "")));
  });
  

  var buyTASData = {
    labels: buyTASlabels,
    internaltionalData: buyTASinternaltionalData,
    waData: buyTASwaData,
    ntData: buyTASntData,
    saData: buyTASsaData,
    vicData: buyTASvicData,
    nswData: buyTASnswData,
    qldData: buyTASqldData,
    tasData: buyTAStasData,
    actData: buyTASactData
  }

  var rentTASlabels = [];
  var rentTASinternaltionalData = [];
  var rentTASwaData = [];
  var rentTASntData = [];
  var rentTASsaData = [];
  var rentTASvicData = [];
  var rentTASnswData = [];
  var rentTASqldData = [];
  var rentTAStasData = [];
  var rentTASactData = [];

  data.sections.rent.data.TAS.forEach(function(item) {
    rentTASlabels.push(item.date);
    rentTASinternaltionalData.push(parseFloat(item['International'].replace("%", "")));
    rentTASwaData.push(parseFloat(item['WA'].replace("%", "")));
    rentTASntData.push(parseFloat(item['NT'].replace("%", "")));
    rentTASsaData.push(parseFloat(item['SA'].replace("%", "")));
    rentTASvicData.push(parseFloat(item['VIC'].replace("%", "")));
    rentTASnswData.push(parseFloat(item['NSW'].replace("%", "")));
    rentTASqldData.push(parseFloat(item['QLD'].replace("%", "")));
    rentTAStasData.push(parseFloat(item['TAS'].replace("%", "")));
    rentTASactData.push(parseFloat(item['ACT'].replace("%", "")));
  });  

  var rentTASData = {
    labels: rentTASlabels,
    internaltionalData: rentTASinternaltionalData,
    waData: rentTASwaData,
    ntData: rentTASntData,
    saData: rentTASsaData,
    vicData: rentTASvicData,
    nswData: rentTASnswData,
    qldData: rentTASqldData,
    tasData: rentTAStasData,
    actData: rentTASactData
  }

  //VIC
  var buyVIClabels = [];
  var buyVICinternaltionalData = [];
  var buyVICwaData = [];
  var buyVICntData = [];
  var buyVICsaData = [];
  var buyVICvicData = [];
  var buyVICnswData = [];
  var buyVICqldData = [];
  var buyVICtasData = [];
  var buyVICactData = [];

  data.sections.buy.data.VIC.forEach(function(item) {
    buyVIClabels.push(item.date);
    buyVICinternaltionalData.push(parseFloat(item['International'].replace("%", "")));
    buyVICwaData.push(parseFloat(item['WA'].replace("%", "")));
    buyVICntData.push(parseFloat(item['NT'].replace("%", "")));
    buyVICsaData.push(parseFloat(item['SA'].replace("%", "")));
    buyVICvicData.push(parseFloat(item['VIC'].replace("%", "")));
    buyVICnswData.push(parseFloat(item['NSW'].replace("%", "")));
    buyVICqldData.push(parseFloat(item['QLD'].replace("%", "")));
    buyVICtasData.push(parseFloat(item['TAS'].replace("%", "")));
    buyVICactData.push(parseFloat(item['ACT'].replace("%", "")));
  });
  

  var buyVICData = {
    labels: buyVIClabels,
    internaltionalData: buyVICinternaltionalData,
    waData: buyVICwaData,
    ntData: buyVICntData,
    saData: buyVICsaData,
    vicData: buyVICvicData,
    nswData: buyVICnswData,
    qldData: buyVICqldData,
    tasData: buyVICtasData,
    actData: buyVICactData
  }

  var rentVIClabels = [];
  var rentVICinternaltionalData = [];
  var rentVICwaData = [];
  var rentVICntData = [];
  var rentVICsaData = [];
  var rentVICvicData = [];
  var rentVICnswData = [];
  var rentVICqldData = [];
  var rentVICtasData = [];
  var rentVICactData = [];

  data.sections.rent.data.VIC.forEach(function(item) {
    rentVIClabels.push(item.date);
    rentVICinternaltionalData.push(parseFloat(item['International'].replace("%", "")));
    rentVICwaData.push(parseFloat(item['WA'].replace("%", "")));
    rentVICntData.push(parseFloat(item['NT'].replace("%", "")));
    rentVICsaData.push(parseFloat(item['SA'].replace("%", "")));
    rentVICvicData.push(parseFloat(item['VIC'].replace("%", "")));
    rentVICnswData.push(parseFloat(item['NSW'].replace("%", "")));
    rentVICqldData.push(parseFloat(item['QLD'].replace("%", "")));
    rentVICtasData.push(parseFloat(item['TAS'].replace("%", "")));
    rentVICactData.push(parseFloat(item['ACT'].replace("%", "")));
  });  

  var rentVICData = {
    labels: rentVIClabels,
    internaltionalData: rentVICinternaltionalData,
    waData: rentVICwaData,
    ntData: rentVICntData,
    saData: rentVICsaData,
    vicData: rentVICvicData,
    nswData: rentVICnswData,
    qldData: rentVICqldData,
    tasData: rentVICtasData,
    actData: rentVICactData
  }

  //NT
  var buyNTlabels = [];
  var buyNTinternaltionalData = [];
  var buyNTwaData = [];
  var buyNTntData = [];
  var buyNTsaData = [];
  var buyNTvicData = [];
  var buyNTnswData = [];
  var buyNTqldData = [];
  var buyNTtasData = [];
  var buyNTactData = [];

  data.sections.buy.data.NT.forEach(function(item) {
    buyNTlabels.push(item.date);
    buyNTinternaltionalData.push(parseFloat(item['International'].replace("%", "")));
    buyNTwaData.push(parseFloat(item['WA'].replace("%", "")));
    buyNTntData.push(parseFloat(item['NT'].replace("%", "")));
    buyNTsaData.push(parseFloat(item['SA'].replace("%", "")));
    buyNTvicData.push(parseFloat(item['VIC'].replace("%", "")));
    buyNTnswData.push(parseFloat(item['NSW'].replace("%", "")));
    buyNTqldData.push(parseFloat(item['QLD'].replace("%", "")));
    buyNTtasData.push(parseFloat(item['TAS'].replace("%", "")));
    buyNTactData.push(parseFloat(item['ACT'].replace("%", "")));
  });
  

  var buyNTData = {
    labels: buyNTlabels,
    internaltionalData: buyNTinternaltionalData,
    waData: buyNTwaData,
    ntData: buyNTntData,
    saData: buyNTsaData,
    vicData: buyNTvicData,
    nswData: buyNTnswData,
    qldData: buyNTqldData,
    tasData: buyNTtasData,
    actData: buyNTactData
  }

  var rentNTlabels = [];
  var rentNTinternaltionalData = [];
  var rentNTwaData = [];
  var rentNTntData = [];
  var rentNTsaData = [];
  var rentNTvicData = [];
  var rentNTnswData = [];
  var rentNTqldData = [];
  var rentNTtasData = [];
  var rentNTactData = [];

  data.sections.rent.data.NT.forEach(function(item) {
    rentNTlabels.push(item.date);
    rentNTinternaltionalData.push(parseFloat(item['International'].replace("%", "")));
    rentNTwaData.push(parseFloat(item['WA'].replace("%", "")));
    rentNTntData.push(parseFloat(item['NT'].replace("%", "")));
    rentNTsaData.push(parseFloat(item['SA'].replace("%", "")));
    rentNTvicData.push(parseFloat(item['VIC'].replace("%", "")));
    rentNTnswData.push(parseFloat(item['NSW'].replace("%", "")));
    rentNTqldData.push(parseFloat(item['QLD'].replace("%", "")));
    rentNTtasData.push(parseFloat(item['TAS'].replace("%", "")));
    rentNTactData.push(parseFloat(item['ACT'].replace("%", "")));
  });  

  var rentNTData = {
    labels: rentNTlabels,
    internaltionalData: rentNTinternaltionalData,
    waData: rentNTwaData,
    ntData: rentNTntData,
    saData: rentNTsaData,
    vicData: rentNTvicData,
    nswData: rentNTnswData,
    qldData: rentNTqldData,
    tasData: rentNTtasData,
    actData: rentNTactData
  }
   

  return {
    buyQLDData,
    rentQLDData,
    buyWAData,
    rentWAData,
    buyNSWData,
    rentNSWData,
    buyACTData,
    rentACTData,
    buySAData,
    rentSAData,
    buyTASData,
    rentTASData,
    buyVICData,
    rentVICData,
    buyNTData,
    rentNTData
  }

	
};
