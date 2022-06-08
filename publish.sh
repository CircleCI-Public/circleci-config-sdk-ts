if [ -n "$CIRCLE_TAG" ]; then
    PATTERN="[0-9]*\.[0-9]*\.[0-9]*(-(alpha|beta))"
    [[ $CIRCLE_TAG =~ $PATTERN ]]
    
    if [ -n "${BASH_REMATCH[2]}" ]; then
        echo "Publishing with ${BASH_REMATCH[2]} tag"
        set -- "$@" --tag "${BASH_REMATCH[2]}"
    fi
fi