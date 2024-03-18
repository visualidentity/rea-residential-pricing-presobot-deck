import _ from 'lodash';
import Requests from '../utils/requests.js';
import SearchCache from '../utils/search-cache.js';
import { getAgentCodes } from '../utils/get-agent-codes.js';

const emptyState = () => {
  return {
    state: {
      agent_code: {
        options: [
          {
            label: 'Select a customer',
            value: ''
          }
        ],
        selectedValue: '',
        disabled: true
      }
    },
    errors: {
      agent_code: []
    }
  };
};

export const agentCode = options => {
  return {
    name: 'agent_code',
    label: 'Agency Code',
    description: 'Please contact your SPOT support team if you require assistance.',
    options: [{ label: 'Select customer', value: '' }],
    onValidate: ({ data, value }) => {
      if (!value) {
        return  {
          errors: ['Cannot create preso, no agency code available for this customer.', 'Please contact your SPOT support team if you require assistance.']
        }
      }
    },
    onSave: ({ data, value }) => {
      const url = `${data.urls.api}rea/agents/`;
      let agent = null;

      if (value !== '') {
        agent = SearchCache.find(url, { code: value });
        if (!agent) {
          const agentRequests = new Requests({
            url: `${url}${value}/`,
            data,
            options
          });

          return agentRequests
            .get()
            .then(results => {
              return {
                context: {
                  agent: _.pick(results, [
                    'code',
                    'lob',
                    'status',
                    'agency_name',
                    'general_email',
                    'general_phone'
                  ]),
                  customer: {
                    agent_code: agent.code,
                    rea_image_large: agent.rea_image_large,
                    primary_colour: agent.primary_colour
                  }
                }
              };
            })
            .catch(error => {
              return {
                context: {
                  agent: {
                    code: value
                  },
                  customer: {
                    agent_code: value
                  }
                }
              };
            });
        }
        
        return {
          context: {
            agent: _.pick(agent, [
              'code',
              'lob',
              'status',
              'agency_name',
              'general_email',
              'general_phone'
            ]),
            customer: {
              agent_code: agent.code,
              rea_image_large: agent.rea_image_large,
              primary_colour: agent.primary_colour
            }
          }
        };
      }
      // if we get here, the validation should have failed.
      return {
        context: {}
      };
    },
    onCustomersChange: ({ data, state }) => {
      if (!_.get(data, 'customers.0', null)) {
        return emptyState();
      }
      return getAgentCodes({ data, state }, options);
    },
    onLoad: ({ data, state }) => {
      if (!_.get(data, 'customers.0', null)) {
        return emptyState();
      }
      return getAgentCodes({ data, state }, options);
    }
  };
};
