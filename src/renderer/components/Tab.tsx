interface Props {
  tag: string;
  active: boolean;
  onClick: any;
}

function Tab({ tag, active, onClick }: Props) {
  return (
    <div
      role="tab"
      className={`tab ${active && 'tab-active'}`}
      onClick={onClick}
    >
      {tag
        .split(' ')
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
        .join(' ')}
    </div>
  );
}

export default Tab;
