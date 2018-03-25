import toReactComponent from 'svgr.macro';

const {
    Check,
    ChevronUp,
    ChevronDown,
    Clippy,
    MarkGithub,
    X,
} = toReactComponent(
    '../../node_modules/octicons/build/svg/*.svg',
    {icon: true},
);

export default {
    Check,
    ChevronUp,
    ChevronDown,
    Clippy,
    MarkGithub,
    X,
};
