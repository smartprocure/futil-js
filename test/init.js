global.__VERSION__ = '1.0.0'

/**
 * @babel/register does not load .ts files by default
 */
require('@babel/register')({ extensions: ['.js', '.jsx', '.ts', '.tsx'] })
