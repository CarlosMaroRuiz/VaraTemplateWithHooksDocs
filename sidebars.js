/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    docs: [
        'intro',
        {
            type: 'category',
            label: 'Hooks',
            items: [
                'hooks/useLocalWallet',
                'hooks/useExtensionWallet',
                'hooks/useContractMutation',
                'hooks/useContractQuery'
            ]
        },
        {
            type: 'category',
            label: 'Providers',
            items: [
                'providers/sails-provider'
            ]
        }
    ]
};

export default sidebars;