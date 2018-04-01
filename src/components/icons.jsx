import toReactComponent from 'svgr.macro';

const {
    Book,
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
    Book,
    Check,
    ChevronUp,
    ChevronDown,
    Clippy,
    MarkGithub,
    X,
};
