import Tab from './Tab';

interface Props {
  tabs: string[];
  activeTab: string;
  onTabClick: (tab: string) => void;
}

function TabList({ tabs, activeTab, onTabClick }: Props) {
  const tab = tabs.map((tab) => (
    <Tab
      key={tab}
      tag={tab}
      active={activeTab === tab}
      onClick={() => onTabClick(tab)}
    />
  ));

  return (
    <div role="tablist" className="tabs tabs-bordered overflow-x-hidden">
      {tab}
    </div>
  );
}

export default TabList;
