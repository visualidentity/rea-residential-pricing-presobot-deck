/* central respoitory for otherwise hardwired
 values to facilitate reuse and easier updating */

var rea_data_source_local = {
	saved_properties: 255098,
	registrations: 10899,
	email_enq: 56450,
	app_downloads:  3025,
	avgdaily_visits_website: 1646798,
	avgdaily_visits_app: 968803,
	visits_from_date: "01/07/2018",
	visits_to_date: "01/06/2019",
	sitesection_visits_avg_daily_buy: 1436969,
	sitesection_listings_avg_daily_buy:1701,
	sitesection_visits_avg_daily_rent:  552264,
	sitesection_listings_avg_daily_rent: 2448,
	behaviour_month: "1/01/2018",
	rea_vs_domain_date: "1/05/2019",
	rea_vs_domain: {
		phone: 6077000,
		tablet: 1069000,
		desktop: 3016000,
		unique: 8883000,
		launches: 32279000
	},
	rea_vs_domain_second_place: {
		phone: 3007000,
		tablet: 652000,
		desktop: 1536000,
		unique: 4695000,
		launches: 7904000
	},

	rea_vs_domain_by_state: {
		vic: {
			rea: 1984000,
			number_two: 1029000,
			both: 756000,
			takeaway: "Over 1.2 million"
		},
		sa: {
			rea: 390000,
			number_two: 164000,
			both: 124000,
			takeaway: "Over 266,000"
		},
		nsw: {
			rea: 2227000,
			number_two: 1632000,
			both: 1186000,
			takeaway: "Over 1 million"
		},
		qld: {
			rea: 1384000,
			number_two: 501000,
			both: 408000,
			takeaway: "Over 900,000"
		},
        tas: {
            rea: 193300,
            number_two: 82000,
            both: 66700,
            takeaway: "Over 120,000"
        },
		wa: {
			bar_style: "rea_first",
			rea: 619000,
			number_two: 397000,
			number_three: 266000,
			takeaway: "1.6 times"
		},
		act: {
			bar_style: "rea_not_first",
			rea: 122300,
			number_two: 98000,
			number_three: 144000,
			takeaway: "122,300"
		}
	},

	behaviour: {
		buy: {
			go_as_far_as_page_2: {
				stat: "page 2 / 40 listings",
				main_site: "47%",
				mobile_site: "56%",
			},
			go_as_far_as_page_3: {
				stat: "page 3 / 60 listings",
				main_site: "31%",
				mobile_site: "35%",
			},
			go_as_far_as_page_4: {
				stat: "page 4 / 80 listings",
				main_site: "22%",
				mobile_site: "24%",
			},
			go_as_far_as_page_5: {
				//	go as far as page 5	15%	16%	11%	14%
				stat: "page 5 / 100 listings",
				main_site: "15%",
				mobile_site: "16%",
			},
			go_as_far_as_page_9: {
				//	go as far as page 9	5%	5%	3%	3%
				stat: "page 9 / 180 listings",
				main_site: "5%",
				mobile_site: "5%",
			}
		},
		rent: {
			go_as_far_as_page_2: {
				stat: "page 2 / 40 listings",
				main_site: "44%",
				mobile_site: "55%",
			},
			go_as_far_as_page_3: {
				stat: "page 3 / 60 listings",
				main_site: "26%",
				mobile_site: "32%",
			},
			go_as_far_as_page_4: {
				stat: "page 4 / 80 listings",
				main_site: "17%",
				mobile_site: "21%",
			},
			go_as_far_as_page_5: {
				stat: "page 5 / 100 listings",
				main_site: "11%",
				mobile_site: "14%",
			},
			go_as_far_as_page_9: {
				stat: "page 9 / 180 listings",
				main_site: "3%",
				mobile_site: "3%",
			}
		}
	}
};
